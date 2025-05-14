using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.DTO.SpecialtyDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface ISpecialtyService
    {
        Task<ApiResponse<bool>> CreateSpecialtyAsync(CreateSpecialtyDTO createSpecialtyDTO);
        Task<ApiResponse<bool>> DeleteSpecialtyByIdAsync(Guid specialtyId);
        Task<ApiResponse<bool>> UpdateSpecialtyByIdAsync(Guid specialtyId, UpdateSpecialtyDTO updateSpecialtyDTO);
        Task<ApiResponse<List<GetSpecialtyDTO>>> GetAllSpecialtyAsync();
    }
}
