using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.VnPayDTO;
using ClinictManagementSystem.Repositories.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/payment")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;
        private readonly IInvoiceService _invoiceService;

        public PaymentController(IVnPayService vnPayService, IUnitOfWork unitOfWork, IConfiguration configuration, IInvoiceService invoiceService)
        {

            _vnPayService = vnPayService;
            _unitOfWork = unitOfWork;
            _configuration = configuration;
            _invoiceService = invoiceService;
        }

        [HttpPost("create-payment-url")]
        public IActionResult CreatePaymentUrlVnpay(PaymentInformationDTO model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Redirect(url);
        }

        [HttpGet("vnpay-callback")]
        public async Task<IActionResult> PaymentCallbackVnpay([FromQuery] VnPayCallbackDTO callbackData)
        {
            var response = _vnPayService.PaymentExecute(callbackData, _configuration["Vnpay:HashSecret"]);

            if (response.VnPayResponseCode == "00")
            {
                // update trạng thái thành công
                await _invoiceService.UpdatePaymentStatusAsync(Guid.Parse(response.OrderId), PaymentStatusEnum.Paid);
                return Redirect("http://localhost:5173/payment-success");
            }
            else
            {
                return Redirect("http://localhost:5173/payment-failure");
            }
        }



    }
}
