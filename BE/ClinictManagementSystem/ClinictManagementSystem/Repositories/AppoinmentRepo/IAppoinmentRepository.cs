using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.AppoinmentRepo
{
    public interface IAppoinmentRepository : IGenericRepository<Appointment>
    {
        Task<int> CountByStatusAsync(AppointmentStatusEnum status);
        Task<int> CountTodayAsync(DateTime today);
        Task<Appointment> GetAppointmentDetailByIdAsync(Guid appointmentId);
        Task<Appointment?> GetAppointmentWithDetailsForInvoiceAsync(Guid appointmentId);
        Task<Pagination<Appointment>> GetAppointmentsWithFilterAsync(
            Expression<Func<Appointment, bool>>? filter = null,
            Func<IQueryable<Appointment>, IOrderedQueryable<Appointment>>? orderBy = null,
            string includeProperties = "",
            int? pageIndex = null,
            int? pageSize = null,
            string? foreignKey = null,
            object? foreignKeyId = null,
            Expression<Func<AppointmentServices, bool>>? relatedDataFilter = null,
            string? relatedDataProperty = null
        );
    }
}
