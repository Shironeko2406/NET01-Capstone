using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("/api/v1/appointments")]
    [ApiController]
    public class AppointmentServiceController : ControllerBase
    {
        private readonly IAppointmentServiceDetailService _appointmentServiceDetailService;

        public AppointmentServiceController(IAppointmentServiceDetailService appointmentServiceDetailService)
        {
            _appointmentServiceDetailService = appointmentServiceDetailService;
        }

        [SwaggerOperation(Summary = "Thêm dịch vụ xét nghiệm vào lịch hẹn")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpPost("{appointmentId}/services")]
        public async Task<ApiResponse<bool>> CreateAppoinmentServiceById(Guid appointmentId, [FromBody] AppointmentServiceCreateListDTO appointmentServiceCreateListDTO)
        {
            return await _appointmentServiceDetailService.CreateAppoinmentServiceById(appointmentId, appointmentServiceCreateListDTO);
        }

        [SwaggerOperation(Summary = "Cập nhật dịch vụ xét nghiệm appointment")]
        [Authorize(Roles = AppRole.Doctor)]
        [HttpPatch("services/{id}")]
        public async Task<ApiResponse<bool>> UpdateAppointmentServiceById(Guid id, AppointmentServiceUpdateDTO appointmentServiceUpdateDTO)
        {
            return await _appointmentServiceDetailService.UpdateAppointmentServiceById(id, appointmentServiceUpdateDTO);
        }

        [SwaggerOperation(Summary = "Cập nhật trạng thái dịch vụ xét nghiệm appointment")]
        [Authorize(Roles = AppRole.Doctor + "," + AppRole.LabTechnician)]
        [HttpPatch("services/{id}/status")]
        public async Task<ApiResponse<bool>> UpdateAppointmentServiceStatusAsync(Guid id, AppointmentServiceStatusEnum appointmentServiceStatusEnum)
        {
            return await _appointmentServiceDetailService.UpdateAppointmentServiceStatusAsync(id, appointmentServiceStatusEnum);
        }

        [SwaggerOperation(Summary = "Cập dịch vụ xét nghiệm theo appointment")]
        [Authorize(Roles = AppRole.Doctor + "," + AppRole.LabTechnician)]
        [HttpGet("{appointmentId}/services")]
        public async Task<ApiResponse<List<AppointmentServiceResponseDTO>>> GetAppointmentServicesByAppointmentIdAsync(Guid appointmentId)
        {
            return await _appointmentServiceDetailService.GetAppointmentServicesByAppointmentIdAsync(appointmentId);
        }
    }
}
