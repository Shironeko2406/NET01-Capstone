using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;
using ClinictManagementSystem.Services;
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

        [HttpPost]
        public async Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO)
        {
            return await _medicineService.CreateMedicineAsync(createMedicineDTO);
        }
    }
}
