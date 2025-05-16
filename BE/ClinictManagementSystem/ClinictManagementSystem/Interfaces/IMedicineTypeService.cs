using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IMedicineTypeService
    {
        Task<ApiResponse<bool>> CreateMedicineTypeAsync(CreateMedicineTypeDTO createMedicineTypeDTO);
        Task<ApiResponse<bool>> DeleteMedicineTypeByIdAsync(Guid medicineTypeId);
        Task<ApiResponse<bool>> UpdateMedicineTypeByIdAsync(Guid medicineTypeId, UpdateMedicineTypeDTO updateMedicineTypeDTO);
        Task<ApiResponse<List<MedicineTypeGetDTO>>> GetAllMedicineTypesAsync();
    }
}
