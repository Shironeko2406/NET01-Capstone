using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/medicine")]
    [ApiController]
    public class MedicineController : ControllerBase
    {
        private readonly IMedicineService _medicineService;

        public MedicineController(IMedicineService medicineService)
        {
            _medicineService = medicineService;
        }

        [Authorize(Roles = AppRole.Admin)]
        [HttpPost]
        public async Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO)
        {
            return await _medicineService.CreateMedicineAsync(createMedicineDTO);
        }

        [HttpGet("filter")]
        public async Task<ApiResponse<Pagination<GetMedicineFilterDTO>>> GetMedicineFilterAsync([FromQuery] FilterMedicineDTO filterMedicineDTO)
        {
            return await _medicineService.GetMedicineFilterAsync(filterMedicineDTO);
        }
    }
}
