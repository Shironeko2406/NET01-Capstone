using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.PrescriptionDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IPrescriptionService
    {
        Task<ApiResponse<bool>> CreatePrescriptionAsync(CreatePrescriptionDTO createPrescriptionDTO);
    }
}
