using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IAppointmentServiceDetailService
    {
        Task<ApiResponse<bool>> CreateAppoinmentServiceById(Guid appointmentId, AppointmentServiceCreateListDTO sppointmentServiceCreateListDTO);
        Task<ApiResponse<bool>> UpdateAppointmentServiceById(Guid id, AppointmentServiceUpdateDTO appointmentServiceUpdateDTO);
        Task<ApiResponse<bool>> UpdateAppointmentServiceStatusAsync(Guid id, AppointmentServiceStatusEnum appointmentServiceStatusEnum);
        Task<ApiResponse<List<AppointmentServiceResponseDTO>>> GetAppointmentServicesByAppointmentIdAsync(Guid appointmentId);
    }
}
