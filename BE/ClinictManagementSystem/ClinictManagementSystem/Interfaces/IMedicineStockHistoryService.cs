using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IMedicineStockHistoryService
    {
        Task<ApiResponse<bool>> CreateMedicineHistoryStockAsync(CreateMedicineManageStockDTO createMedicineManageStockDTO);
    }
}
