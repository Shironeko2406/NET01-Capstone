using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.UsersDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IUserService
    {
        Task<ApiResponse<bool>> RegisterPatientAsync(RegisterPatientDTO registerPatientDTO);
        Task<UserLoginRequestDTO> GenerateUserCredentials(string fullname);
        Task<ApiResponse<bool>> CreateUserAccountInternalAsync(CreateUserAccountInternalDTO createUserAccountInternalDTO);
        Task<ApiResponse<Pagination<GetUsersDTO>>> FilterUserByAdminAsync(FilterUsersDTO filterUsersDTO);
        Task<ApiResponse<UserDetailDTO>> GetUserByLoginAsync();
        Task<ApiResponse<bool>> UpdateUserLoginAsync(UpdateUserDTO updateUserDTO);
    }
}
