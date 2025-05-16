using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IMedicineService
    {
        Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO);
    }
}
