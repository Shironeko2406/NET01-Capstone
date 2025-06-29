using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.InvoiceRepo
{
    public class InvoiceRepository : GenericRepository<Invoice>, IInvoiceRepository
    {
        private readonly AppDbContext _dbContext;
        public InvoiceRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<Invoice?> GetDetailInvoiceIdAsync(Guid invoiceId)
        {
            return await _dbContext.Invoices
                .Include(i => i.Appointment)
                    .ThenInclude(a => a.Prescription)
                        .ThenInclude(p => p.PrescriptionDetails)
                            .ThenInclude(pd => pd.Medicine)
                .FirstOrDefaultAsync(i => i.InvoiceId == invoiceId);
        }

        public async Task<List<Invoice>> GetInvoicesByTimeRangeAsync(DateTime start, DateTime end)
        {
            return await _dbContext.Invoices
                .Where(x => !x.IsDeleted &&
                            x.PaymentStatus == PaymentStatusEnum.Paid &&
                            x.PaymentDate >= start &&
                            x.PaymentDate <= end)
                .ToListAsync();
        }
    }
}
