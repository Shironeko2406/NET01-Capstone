using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.PrescriptionDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IPrescriptionService
    {
        Task<ApiResponse<bool>> CreatePrescriptionAsync(CreatePrescriptionDTO createPrescriptionDTO);
        Task<ApiResponse<bool>> UpdatePrescriptionAppointmentIdAsync(Guid appointmentId, UpdatePrescriptionDTO updatePrescriptionDTO);
        Task<ApiResponse<bool>> DeleteMedicineInPrescriptionDetailAsync(Guid id);

    }
}
