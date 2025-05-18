using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.UsersDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [SwaggerOperation(Summary = "đăng nhập bằng UserName và Password")]
        [HttpPost("login")]
        public async Task<ApiResponse<UserLoginResponseDTO>> LoginAsync(UserLoginRequestDTO userLoginRequest)
        {
            return await _authenticationService.LoginAsync(userLoginRequest);
        }
    }
}
