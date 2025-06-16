using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.PrescriptionDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/prescription")]
    [ApiController]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;

        public PrescriptionController(IPrescriptionService prescriptionService)
        {
            _prescriptionService = prescriptionService;
        }

        [SwaggerOperation(Summary = "Tạo kê đơn thuốc cho lịch khám")]
        [HttpPost]
        public async Task<ApiResponse<bool>> CreatePrescriptionAsync(CreatePrescriptionDTO createPrescriptionDTO)
        {
            return await _prescriptionService.CreatePrescriptionAsync(createPrescriptionDTO);
        }

        [SwaggerOperation(Summary = "Sựa lại đơn thuốc cho lịch khám")]
        [HttpPut("{appointmentId}")]
        public async Task<ApiResponse<bool>> UpdatePrescriptionAppointmentIdAsync(Guid appointmentId, UpdatePrescriptionDTO updatePrescriptionDTO)
        {
            return await _prescriptionService.UpdatePrescriptionAppointmentIdAsync(appointmentId, updatePrescriptionDTO);
        }

        [SwaggerOperation(Summary = "Xóa thuốc trong đơn thuốc")]
        [HttpDelete("~/api/v1/prescription-detail/{id}")]
        public async Task<ApiResponse<bool>> DeleteMedicineInPrescriptionDetailAsync(Guid id)
        {
            return await _prescriptionService.DeleteMedicineInPrescriptionDetailAsync(id);
        }
    }
}
