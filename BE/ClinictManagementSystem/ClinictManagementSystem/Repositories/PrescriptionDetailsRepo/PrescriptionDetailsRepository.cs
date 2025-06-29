using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.PrescriptionDetailsRepo
{
    public class PrescriptionDetailsRepository : GenericRepository<PrescriptionDetails>, IPrescriptionDetailsRepository
    {
        private readonly AppDbContext _dbContext;
        public PrescriptionDetailsRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<int> GetTotalMedicinesSold(DateTime start, DateTime end)
        {
            return await _dbContext.PrescriptionDetails
                .Where(x => !x.IsDeleted &&
                            x.Prescription.Appointment.Invoice != null &&
                            x.Prescription.Appointment.Invoice.PaymentStatus == PaymentStatusEnum.Paid &&
                            x.Prescription.Appointment.Invoice.PaymentDate >= start &&
                            x.Prescription.Appointment.Invoice.PaymentDate <= end)
                .Select(x => x.Quantity)
                .SumAsync();
        }

        public async Task<int> GetTotalMedicineRevenueByAppointmentIdsAsync(List<Guid> appointmentIds)
        {
            return await _dbContext.PrescriptionDetails
                .Where(x => !x.IsDeleted &&
                            appointmentIds.Contains(x.Prescription.AppointmentId))
                .SumAsync(x => x.Medicine.Price * x.Quantity);
        }
        public async Task<int> GetTotalMedicineRevenueAsync()
        {
            return await _dbContext.PrescriptionDetails
                .Where(x => !x.IsDeleted &&
                            x.Prescription != null &&
                            x.Prescription.Appointment.Invoice != null &&
                            x.Prescription.Appointment.Invoice.PaymentStatus == PaymentStatusEnum.Paid)
                .SumAsync(x => x.Medicine.Price * x.Quantity);
        }

        public async Task<List<TopMedicineSoldDTO>> GetTopMedicinesSoldAsync(int top = 5)
        {
            return await _dbContext.PrescriptionDetails
                .Where(x => !x.IsDeleted &&
                            x.Prescription.Appointment.Invoice != null &&
                            x.Prescription.Appointment.Invoice.PaymentStatus == PaymentStatusEnum.Paid)
                .GroupBy(x => new
                {
                    x.MedicineId,
                    x.Medicine.Name,
                    x.Medicine.Unit,
                    x.Medicine.Price
                })
                .Select(g => new TopMedicineSoldDTO
                {
                    MedicineName = g.Key.Name,
                    Quantity = g.Sum(x => x.Quantity),
                    Revenue = g.Sum(x => x.Quantity * g.Key.Price),
                    Unit = g.Key.Unit
                })
                .OrderByDescending(x => x.Revenue)
                .Take(top)
                .ToListAsync();
        }
    }
}
