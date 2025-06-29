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
    [Route("api/v1/appointment")]
    [ApiController]
    public class AppoinmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppoinmentController(IAppointmentService appointmentServicce)
        {
            _appointmentService = appointmentServicce;
        }

        [SwaggerOperation(Summary = "Phân quyền Patient")]
        [Authorize(Roles = AppRole.Patient)]
        [HttpPost("login")]
        public async Task<ApiResponse<bool>> CreateAppoinment(CreateAppoinmentDTO createAppoinmentDTO)
        {
            return await _appointmentService.CreateAppoinment(createAppoinmentDTO);
        }

        [SwaggerOperation(Summary = "Cập nhật trạng thái lịch khám")]
        [Authorize(Roles = AppRole.Admin + "," + AppRole.Doctor + "," + AppRole.Receptionist)]
        [HttpPut("{id}/status")]
        public async Task<ApiResponse<bool>> UpdateAppointmentStatusAsync(Guid id, AppointmentStatusEnum appointmentStatusEnum)
        {
            return await _appointmentService.UpdateAppointmentStatusAsync(id, appointmentStatusEnum);
        }

        [SwaggerOperation(Summary = "Lấy appointment bằng user login và filter")]
        [Authorize(Roles = AppRole.Patient)]
        [HttpGet("patient")]
        public async Task<ApiResponse<Pagination<GetAppointmentDTO>>> GetAppoinmentFilterByUserLoginAsync([FromQuery] FilterAppoinmentByPatientLoginDTO filterAppoinmentByPatientLoginDTO)
        {
            return await _appointmentService.GetAppoinmentFilterByUserLoginAsync(filterAppoinmentByPatientLoginDTO);
        }

        [SwaggerOperation(Summary = "quản lý appointments cho admin và receptionist")]
        [Authorize(Roles = AppRole.Admin + "," + AppRole.Receptionist)]
        [HttpGet]
        public async Task<ApiResponse<Pagination<AppointmentManagementDTO>>> GetAppointmentsForAdminAsync([FromQuery] FilterAppointmentAdminDTO filterAppointmentAdminDTO)
        {
            return await _appointmentService.GetAppointmentsForAdminAsync(filterAppointmentAdminDTO);
        }

        [SwaggerOperation(Summary = "Lấy appointment bằng doctor login và filter")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpGet("doctor")]
        public async Task<ApiResponse<Pagination<GetAppointmentByDoctorDTO>>> GetAppoinmentFilterByDoctorLoginAsync([FromQuery] FilterAppoinmentByDoctorLoginDTO filterAppoinmentByDoctorLoginDTO)
        {
            return await _appointmentService.GetAppoinmentFilterByDoctorLoginAsync(filterAppoinmentByDoctorLoginDTO);
        }

        [SwaggerOperation(Summary = "Kết luận tổng quát appointment")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpPatch("{appointmentId}/conclusion")]
        public async Task<ApiResponse<bool>> UpdateAppointmentConclusionAsync(Guid appointmentId, UpdateConclusionDTO updateConclusionDTO)
        {
            return await _appointmentService.UpdateAppointmentConclusionAsync(appointmentId, updateConclusionDTO);
        }

        [SwaggerOperation(Summary = "Cập nhật triệu chứng appointment")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpPatch("{appointmentId}/symptom")]
        public async Task<ApiResponse<bool>> UpdateAppointmentSymptomsAsync(Guid appointmentId, UpdateSymptomDTO updateSymptomDTO)
        {
            return await _appointmentService.UpdateAppointmentSymptomsAsync(appointmentId, updateSymptomDTO);
        }

        [SwaggerOperation(Summary = "Phân quyền Receptionist")]
        [Authorize(Roles = AppRole.Receptionist)]
        [HttpPost("~/api/v1/receptionist/appointment")]
        public async Task<ApiResponse<bool>> CreateAppointmentByReceptionist(CreateAppointmentByReceptionistDTO createAppointmentByReceptionistDTO)
        {
            return await _appointmentService.CreateAppointmentByReceptionist(createAppointmentByReceptionistDTO);
        }

        [SwaggerOperation(Summary = "Phân quyền LabTechnician")]
        //[Authorize(Roles = AppRole.Receptionist)]
        [HttpGet("labTech")]
        public async Task<ApiResponse<Pagination<GetAppointmentForLabTech>>> GetAppointmentsForLabTechnicianAsync([FromQuery]FilterAppointmentLabTechDTO filterAppointmentLabTechDTO)
        {
            return await _appointmentService.GetAppointmentsForLabTechnicianAsync(filterAppointmentLabTechDTO);
        }

        [SwaggerOperation(Summary = "Chi tiết lịch khám")]
        [HttpGet("{appointmentId}")]
        public async Task<ApiResponse<GetAppointmentDetailDTO>> GetAppointmentDetailAsync(Guid appointmentId)
        {
            return await _appointmentService.GetAppointmentDetailAsync(appointmentId);
        }

    }
}
