using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/appoinment")]
    [ApiController]
    public class AppoinmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppoinmentController(IAppointmentService appointmentServicce)
        {
            _appointmentService = appointmentServicce;
        }

        [SwaggerOperation(Summary = "Tạo lịch khám với bác sĩ")]
        [HttpPost]
        public async Task<ApiResponse<bool>> CreateAppoinment(CreateAppoinmentDTO createAppoinmentDTO)
        {
            return await _appointmentService.CreateAppoinment(createAppoinmentDTO);
        }

        [SwaggerOperation(Summary = "Cập nhật trạng thái lịch khám")]
        [HttpPut("{id}")]
        public async Task<ApiResponse<bool>> UpdateAppointmentStatusAsync(Guid id, AppointmentStatusEnum appointmentStatusEnum)
        {
            return await _appointmentService.UpdateAppointmentStatusAsync(id, appointmentStatusEnum);
        }

        [SwaggerOperation(Summary = "Lấy appointment bằng user login và filter")]
        [Authorize(Roles = AppRole.Patient)]
        [HttpGet("patient/login")]
        public async Task<ApiResponse<Pagination<GetAppointmentDTO>>> GetAppoinmentFilterByUserLoginAsync([FromQuery] FilterAppoinmentByPatientLoginDTO filterAppoinmentByPatientLoginDTO)
        {
            return await _appointmentService.GetAppoinmentFilterByUserLoginAsync(filterAppoinmentByPatientLoginDTO);
        }

        [SwaggerOperation(Summary = "quản lý appointments cho admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("admin")]
        public async Task<ApiResponse<Pagination<AppointmentManagementDTO>>> GetAppointmentsForAdminAsync([FromQuery] FilterAppointmentAdminDTO filterAppointmentAdminDTO)
        {
            return await _appointmentService.GetAppointmentsForAdminAsync(filterAppointmentAdminDTO);
        }

        [SwaggerOperation(Summary = "Lấy appointment bằng doctor login và filter")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpGet("doctor/login")]
        public async Task<ApiResponse<Pagination<GetAppointmentByDoctorDTO>>> GetAppoinmentFilterByDoctorLoginAsync([FromQuery] FilterAppoinmentByDoctorLoginDTO filterAppoinmentByDoctorLoginDTO)
        {
            return await _appointmentService.GetAppoinmentFilterByDoctorLoginAsync(filterAppoinmentByDoctorLoginDTO);
        }
    }
}
