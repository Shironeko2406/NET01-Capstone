using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.AppointmentServicesRepo
{
    public interface IAppointmentServicesRepository : IGenericRepository<AppointmentServices>
    {
        Task<List<AppointmentServices>> GetByAppointmentIdWithServiceAsync(Guid appointmentId);
        Task<int> GetTotalTestRevenueByAppointmentIdsAsync(List<Guid> appointmentIds);
        Task<int> GetTotalTestRevenueAsync();
        Task<List<TopServiceRevenueDTO>> GetTopServiceRevenuesAsync(int top = 5);
    }
}
