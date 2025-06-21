using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.UsersDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IAppointmentService
    {
        Task<ApiResponse<bool>> CreateAppoinment(CreateAppoinmentDTO createAppoinmentDTO);
        Task<ApiResponse<bool>> CreateAppointmentByReceptionist(CreateAppointmentByReceptionistDTO createAppointmentByReceptionistDTO);
        Task<ApiResponse<bool>> UpdateAppointmentStatusAsync(Guid appointmentId, AppointmentStatusEnum appointmentStatusEnum);
        Task<ApiResponse<Pagination<GetAppointmentDTO>>> GetAppoinmentFilterByUserLoginAsync(FilterAppoinmentByPatientLoginDTO filterAppoinmentByPatientLoginDTO);
        Task<ApiResponse<Pagination<AppointmentManagementDTO>>> GetAppointmentsForAdminAsync(FilterAppointmentAdminDTO filterAppointmentAdminDTO);
        Task<ApiResponse<Pagination<GetAppointmentByDoctorDTO>>> GetAppoinmentFilterByDoctorLoginAsync(FilterAppoinmentByDoctorLoginDTO filterAppoinmentByDoctorLoginDTO);
        Task<ApiResponse<Pagination<GetAppointmentForLabTech>>> GetAppointmentsForLabTechnicianAsync(FilterAppointmentLabTechDTO filterAppointmentLabTechDTO);
        Task<ApiResponse<bool>> UpdateAppointmentConclusionAsync(Guid appointmentId, UpdateConclusionDTO updateConclusionDTO);
        Task<ApiResponse<bool>> UpdateAppointmentSymptomsAsync(Guid appointmentId, UpdateSymptomDTO updateSymptomDTO);
        Task<string> GenerateRandomAppointmentCodeAsync();
        Task<ApiResponse<GetAppointmentDetailDTO>> GetAppointmentDetailAsync(Guid appointmentId);
    }
}
