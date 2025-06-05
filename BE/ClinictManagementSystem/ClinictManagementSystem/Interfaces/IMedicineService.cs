using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IMedicineService
    {
        Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO);
        Task<ApiResponse<Pagination<GetMedicineFilterDTO>>> GetMedicineFilterAsync(FilterMedicineDTO filterMedicineDTO);
        Task<string> GenerateMedicineCodeAsync();
    }
}
