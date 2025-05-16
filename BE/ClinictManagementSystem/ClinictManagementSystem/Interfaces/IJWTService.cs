using ClinictManagementSystem.Models.Entity;
using System.Security.Claims;

namespace ClinictManagementSystem.Interfaces
{
    public interface IJWTService
    {
        public string GenerateJWT(Users user);
        public string GenerateRefreshToken();
        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
