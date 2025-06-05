using ClinictManagementSystem.Interfaces;
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
        }
        public async Task<List<AppointmentServices>> GetByAppointmentIdWithServiceAsync(Guid appointmentId)
        {
            return await _dbContext.AppointmentServices
                .Where(x => x.AppointmentId == appointmentId && !x.IsDeleted)
                .Include(x => x.Service)
                .ToListAsync();
        }

    }
}
