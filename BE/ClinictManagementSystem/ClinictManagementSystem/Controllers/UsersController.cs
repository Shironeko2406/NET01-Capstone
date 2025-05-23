using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.DoctorScheduleDTO;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.UsersDTO;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/user")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ApiResponse<bool>> RegisterPatientAsync(RegisterPatientDTO registerPatientDTO)
        {
            return await _userService.RegisterPatientAsync(registerPatientDTO);
        }

        [Authorize(Roles = AppRole.Admin + "," + AppRole.Receptionist)]
        [HttpPost("register/internal")]
        public async Task<ApiResponse<bool>> CreateUserAccountInternalAsync(CreateUserAccountInternalDTO createUserAccountInternalDTO)
        {
            return await _userService.CreateUserAccountInternalAsync(createUserAccountInternalDTO);
        }

        [HttpGet("filter")]
        public async Task<ApiResponse<Pagination<GetUsersDTO>>> FilterUserByAdminAsync([FromQuery] FilterUsersDTO filterUsersDTO)
        {
            return await _userService.FilterUserByAdminAsync(filterUsersDTO);
        }

        [Authorize(Roles = AppRole.Admin + "," + AppRole.Receptionist + "," + AppRole.Doctor + "," + AppRole.Patient)]
        [HttpGet("login")]
        public async Task<ApiResponse<UserDetailDTO>> GetUserByLoginAsync()
        {
            return await _userService.GetUserByLoginAsync();
        }

        [Authorize(Roles = AppRole.Admin + "," + AppRole.Receptionist + "," + AppRole.Patient)]
        [SwaggerOperation(Summary = "Phân quyền: Admin, Receptionist, Patient")]
        [HttpPut("login")]
        public async Task<ApiResponse<bool>> UpdateUserLoginAsync(UpdateUserDTO updateUserDTO)
        {
            return await _userService.UpdateUserLoginAsync(updateUserDTO);
        }

        //[Authorize(Roles = AppRole.Admin + "," + AppRole.Receptionist + "," + AppRole.Patient)]
        [SwaggerOperation(Summary = "Phân quyền: Admin, Receptionist, Patient")]
        [HttpGet("doctor-avaiable")]
        public async Task<ApiResponse<List<DoctorGetDTO>>> GetAvailableDoctorsAsync([FromQuery] DoctorAvailabilityFilterDTO doctorAvailabilityFilterDTO)
        {
            return await _userService.GetAvailableDoctorsAsync(doctorAvailabilityFilterDTO);
        }
    }
}
