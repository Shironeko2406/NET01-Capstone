using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/medicineStockHistory")]
    [ApiController]
    public class MedicineStockHistoryController : ControllerBase
    {
        private readonly IMedicineStockHistoryService _medicineStockHistoryService;

        public MedicineStockHistoryController(IMedicineStockHistoryService medicineStockHistoryService)
        {
            _medicineStockHistoryService = medicineStockHistoryService;
        }

        [HttpPost]
        public async Task<ApiResponse<bool>> CreateMedicineHistoryStockAsync(CreateMedicineManageStockDTO createMedicineManageStockDTO)
        {
            return await _medicineStockHistoryService.CreateMedicineHistoryStockAsync(createMedicineManageStockDTO);
        }
    }
}
