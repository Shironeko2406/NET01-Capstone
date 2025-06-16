using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineRepo;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.AppoinmentRepo
{
    public class AppoinmentRepository : GenericRepository<Appointment>, IAppoinmentRepository
    {
        private readonly AppDbContext _dbContext;
        public AppoinmentRepository(
            AppDbContext context,
            ICurrentTime timeService,
            IClaimsService claimsService)
            : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<int> CountByStatusAsync(AppointmentStatusEnum status)
        {
            return await _dbContext.Appointments
                .Where(a => !a.IsDeleted && a.Status == status)
                .CountAsync();
        }

        public async Task<int> CountTodayAsync(DateTime today)
        {
            return await _dbContext.Appointments
                .Where(a => !a.IsDeleted && a.AppointmentDate.Date == today.Date)
                .CountAsync();
        }

        public async Task<Appointment?> GetAppointmentDetailByIdAsync(Guid appointmentId)
        {
            return await _dbContext.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Specialty)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(aps => aps.Service)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(aps => aps.TestResult)
                        .ThenInclude(tr => tr.UpdatedByUser)
                .Include(a => a.Prescription)
                    .ThenInclude(p => p.PrescriptionDetails)
                        .ThenInclude(pd => pd.Medicine)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
        }

        public async Task<Appointment?> GetAppointmentWithDetailsForInvoiceAsync(Guid appointmentId)
        {
            return await _dbContext.Appointments
                .Include(a => a.AppointmentServices)
                    .ThenInclude(aps => aps.Service)
                .Include(a => a.Prescription)
                    .ThenInclude(p => p.PrescriptionDetails)
                        .ThenInclude(pd => pd.Medicine)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && !a.IsDeleted);
        }

    }
}
