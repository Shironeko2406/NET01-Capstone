using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.AppointmentServicesRepo
{
    public interface IAppointmentServicesRepository : IGenericRepository<AppointmentServices>
    {
        Task<List<AppointmentServices>> GetByAppointmentIdWithServiceAsync(Guid appointmentId);

    }
}
