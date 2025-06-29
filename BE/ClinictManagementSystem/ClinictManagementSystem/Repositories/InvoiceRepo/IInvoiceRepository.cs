using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.InvoiceRepo
{
    public interface IInvoiceRepository : IGenericRepository<Invoice>
    {
        Task<Invoice?> GetDetailInvoiceIdAsync(Guid invoiceId);
        Task<List<Invoice>> GetInvoicesByTimeRangeAsync(DateTime start, DateTime end);
    }
}
