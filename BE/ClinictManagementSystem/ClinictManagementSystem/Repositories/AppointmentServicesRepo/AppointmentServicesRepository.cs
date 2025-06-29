using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.DoctorScheduleRepo;
using ClinictManagementSystem.Repositories.Generic;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.AppointmentServicesRepo
{
    public class AppointmentServicesRepository : GenericRepository<AppointmentServices>, IAppointmentServicesRepository
    {
        private readonly AppDbContext _dbContext;
        public AppointmentServicesRepository(
            AppDbContext context,
            ICurrentTime timeService,
            IClaimsService claimsService)
            : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }
        public async Task<List<AppointmentServices>> GetByAppointmentIdWithServiceAsync(Guid appointmentId)
        {
            return await _dbContext.AppointmentServices
                .Where(x => x.AppointmentId == appointmentId && !x.IsDeleted)
                .Include(x => x.Service)
                .Include(x => x.TestResult)
                .ToListAsync();
        }
        public async Task<int> GetTotalTestRevenueByAppointmentIdsAsync(List<Guid> appointmentIds)
        {
            return await _dbContext.AppointmentServices
                .Where(x => !x.IsDeleted && appointmentIds.Contains(x.AppointmentId))
                .SumAsync(x => x.Service.Price);
        }
        public async Task<int> GetTotalTestRevenueAsync()
        {
            return await _dbContext.AppointmentServices
                .Where(x => !x.IsDeleted &&
                            x.Appointment.Invoice != null &&
                            x.Appointment.Invoice.PaymentStatus == PaymentStatusEnum.Paid)
                .SumAsync(x => x.Service.Price);
        }
        public async Task<List<TopServiceRevenueDTO>> GetTopServiceRevenuesAsync(int top = 5)
        {
            return await _dbContext.AppointmentServices
                .Where(x => !x.IsDeleted &&
                            x.Appointment.Invoice != null &&
                            x.Appointment.Invoice.PaymentStatus == PaymentStatusEnum.Paid)
                .GroupBy(x => new
                {
                    x.ServiceId,
                    x.Service.Name,
                    x.Service.Price
                })
                .Select(g => new TopServiceRevenueDTO
                {
                    ServiceName = g.Key.Name,
                    AppointmentCount = g.Count(),
                    Revenue = g.Sum(x => g.Key.Price)
                })
                .OrderByDescending(x => x.Revenue)
                .Take(top)
                .ToListAsync();
        }
    }
}
