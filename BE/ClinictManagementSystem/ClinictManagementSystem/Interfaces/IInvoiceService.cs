using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Interfaces
{
    public interface IInvoiceService
    {
        Task<bool> UpdatePaymentStatusAsync(Guid invoiceId, PaymentStatusEnum paymentStatusEnum);
    }
}
