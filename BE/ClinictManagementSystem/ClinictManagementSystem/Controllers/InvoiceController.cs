using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/invoice")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public InvoiceController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        //[HttpGet("create-payment")]
        //public async Task<ApiResponse<string>> CreatePaymentUrl(Guid invoiceId)
        //{
        //  return  await _vnPayService.CreatePaymentUrl(invoiceId);
        //}

        [HttpGet("{invoiceId}/payment-url")]
        public async Task<IActionResult> GetInvoicePaymentUrl(Guid invoiceId)
        {
            try
            {
                var paymentUrl = await _vnPayService.CreateInvoicePaymentUrl(invoiceId);
                return Ok(new
                {
                    Success = true,
                    PaymentUrl = paymentUrl
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }
}
