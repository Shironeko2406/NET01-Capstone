using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

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

        [SwaggerOperation(Summary = "Tạo Lịch sử kho thuốc: Phân quyền Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpPost]
        public async Task<ApiResponse<bool>> CreateMedicineHistoryStockAsync(CreateMedicineManageStockDTO createMedicineManageStockDTO)
        {
            return await _medicineStockHistoryService.CreateMedicineHistoryStockAsync(createMedicineManageStockDTO);
        }

        [SwaggerOperation(Summary = "Phân quyền Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet]
        public async Task<ApiResponse<Pagination<GetMedicineStockHistoryDTO>>> GetMedicineStockHistoryFilterAsync([FromQuery] MedicineStockHistoryFilterDTO medicineStockHistoryFilterDTO)
        {
            return await _medicineStockHistoryService.GetMedicineStockHistoryFilterAsync(medicineStockHistoryFilterDTO);
        }
    }
}
