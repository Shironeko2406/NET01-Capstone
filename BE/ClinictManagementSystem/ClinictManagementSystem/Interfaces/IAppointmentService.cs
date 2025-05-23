using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.UsersDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IAppointmentService
    {
        Task<ApiResponse<bool>> CreateAppoinment(CreateAppoinmentDTO createAppoinmentDTO);
        Task<ApiResponse<bool>> UpdateAppointmentStatusAsync(Guid appointmentId, AppointmentStatusEnum appointmentStatusEnum);
        Task<ApiResponse<Pagination<GetAppointmentDTO>>> GetAppoinmentFilterByUserLoginAsync(FilterAppoinmentByPatientLoginDTO filterAppoinmentByPatientLoginDTO);
        Task<ApiResponse<Pagination<AppointmentManagementDTO>>> GetAppointmentsForAdminAsync(FilterAppointmentAdminDTO filterAppointmentAdminDTO);
        Task<ApiResponse<Pagination<GetAppointmentByDoctorDTO>>> GetAppoinmentFilterByDoctorLoginAsync(FilterAppoinmentByDoctorLoginDTO filterAppoinmentByDoctorLoginDTO);
        Task<string> GenerateRandomAppointmentCodeAsync();
    }
}
