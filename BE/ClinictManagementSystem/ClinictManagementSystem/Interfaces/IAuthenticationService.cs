using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.UsersDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IAuthenticationService
    {
        Task<ApiResponse<UserLoginResponseDTO>> LoginAsync(UserLoginRequestDTO userLoginRequest);
    }
}
