using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.VnPayDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationDTO model, HttpContext context);
        //PaymentResponseDTO PaymentExecute(IQueryCollection collections);
        PaymentResponseDTO PaymentExecute(VnPayCallbackDTO data, string hashSecret);
        Task<string> CreateInvoicePaymentUrl(Guid invoiceId);
        //Task<PaymentResult> CreatePaymentUrlCallback(VnPayCallbackDTO vnPayCallbackDTO);
        //Task<ApiResponse<string>> CreatePaymentUrl(Guid invoiceId);
    }
}
