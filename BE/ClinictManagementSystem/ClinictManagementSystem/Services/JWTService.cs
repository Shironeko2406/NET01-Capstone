using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace ClinictManagementSystem.Services
{
    public class JWTService : IJWTService
    {
        private readonly IConfiguration _configuration;

        public JWTService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateJWT(Users user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var roles = user.UserRoles?.Select(ur => ur.Role.RoleName).ToList();
            var specialties = user.DoctorSpecialties?.Select(ds => ds.Specialty.Name).ToList();

            // Tạo claim cơ bản
            var claims = new List<Claim>
            {
                new Claim("UserId", user.UserId.ToString()),
                new Claim("UserName", user.Username),
                new Claim("FullName", user.FullName ?? ""),
                new Claim("Email", user.Email ?? ""),
                new Claim("PhoneNumber", user.PhoneNumber ?? ""),
                new Claim("Gender", user.Gender.ToString()),
                new Claim("DateOfBirth", user.DateOfBirth.ToString("yyyy-MM-dd")),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };


            // Thêm role claims (standard)
            claims.AddRange(roles.Select(role => new Claim("role", role)));

            // Thêm specialty claims (custom)
            claims.AddRange(specialties.Select(spec => new Claim("Specialty", spec)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(10),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateRefreshToken()
        {
            var random = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(random);
            return Convert.ToBase64String(random);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]);

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false, // 👈 Bỏ qua kiểm tra hết hạn
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);

            if (validatedToken is JwtSecurityToken jwtToken &&
                jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return principal;
            }

            return null;
        }
    }
}
