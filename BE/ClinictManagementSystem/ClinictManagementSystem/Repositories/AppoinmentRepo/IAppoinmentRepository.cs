using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.AppoinmentRepo
{
    public interface IAppoinmentRepository : IGenericRepository<Appointment>
    {
        Task<int> CountByStatusAsync(AppointmentStatusEnum status);
        Task<int> CountTodayAsync(DateTime today);
        Task<Appointment> GetAppointmentDetailByIdAsync(Guid appointmentId);
        Task<Appointment?> GetAppointmentWithDetailsForInvoiceAsync(Guid appointmentId);
    }
}
