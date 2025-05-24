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
    }
}
