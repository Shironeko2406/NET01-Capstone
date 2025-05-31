using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.VnPayDTO;
using ClinictManagementSystem.Repositories.UnitOfWork;
using ClinictManagementSystem.Utils;
using Microsoft.Extensions.Options;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace ClinictManagementSystem.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;
        private readonly VnPayConfig _vnPayConfig;
        private readonly ICurrentTime _currentTime;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VnPayService(
            IConfiguration configuration,
            ICurrentTime currentTime,
            IUnitOfWork unitOfWork,
            IOptions<VnPayConfig> vnPayConfig,
            IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _currentTime = currentTime;
            _unitOfWork = unitOfWork;
            _vnPayConfig = vnPayConfig.Value;
            _httpContextAccessor = httpContextAccessor;
        }


        public string CreatePaymentUrl(PaymentInformationDTO model, HttpContext context)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_configuration["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();
            var pay = new VnPayLibrary();
            var urlCallBack = _configuration["Vnpay:PaymentBackReturnUrl"];
            var vnpayTxnRef = model.InvoiceId.ToString();

            pay.AddRequestData("vnp_Version", _configuration["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _configuration["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _configuration["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)model.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _configuration["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
            pay.AddRequestData("vnp_Locale", _configuration["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"Hóa đơn khám bệnh {model.InvoiceId}");
            pay.AddRequestData("vnp_OrderType", model.OrderType);
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", vnpayTxnRef);

            var paymentUrl =
                pay.CreateRequestUrl(_configuration["Vnpay:BaseUrl"], _configuration["Vnpay:HashSecret"]);

            return paymentUrl;
        }

        public PaymentResponseDTO PaymentExecute(VnPayCallbackDTO vnPayCallbackDTO, string hashSecret)
        {
            var pay = new VnPayLibrary();

            var responseData = new Dictionary<string, string>()
            {
                { "vnp_Amount", vnPayCallbackDTO.vnp_Amount },
                { "vnp_BankCode", vnPayCallbackDTO.vnp_BankCode },
                { "vnp_OrderInfo", vnPayCallbackDTO.vnp_OrderInfo },
                { "vnp_PayDate", vnPayCallbackDTO.vnp_PayDate },
                { "vnp_ResponseCode", vnPayCallbackDTO.vnp_ResponseCode },
                { "vnp_TmnCode", vnPayCallbackDTO.vnp_TmnCode },
                { "vnp_TransactionNo", vnPayCallbackDTO.vnp_TransactionNo },
                { "vnp_TransactionStatus", vnPayCallbackDTO.vnp_TransactionStatus },
                { "vnp_TxnRef", vnPayCallbackDTO.vnp_TxnRef }
            };

            if (string.IsNullOrEmpty(vnPayCallbackDTO.vnp_SecureHash))
            {
                return new PaymentResponseDTO
                {
                    Success = false,
                    Token = null,
                    VnPayResponseCode = vnPayCallbackDTO.vnp_ResponseCode,
                    TxnRef = vnPayCallbackDTO.vnp_TxnRef
                };
            }

            foreach (var kvp in responseData)
            {
                pay.AddResponseData(kvp.Key, kvp.Value);
            }

            var vnpSecureHash = vnPayCallbackDTO.vnp_SecureHash;

            //var checkSignature = pay.ValidateSignature(vnpSecureHash, hashSecret);
            //if (!checkSignature)
            //{
            //    return new PaymentResponseDTO() { Success = false };
            //}

            // ✅ Bước 4: Kiểm tra kết quả thanh toán thành công
            if (vnPayCallbackDTO.vnp_ResponseCode == "00" && vnPayCallbackDTO.vnp_TransactionStatus == "00")
            {
                return new PaymentResponseDTO
                {
                    Success = true,
                    PaymentMethod = "VnPay",
                    OrderDescription = vnPayCallbackDTO.vnp_OrderInfo,
                    OrderId = vnPayCallbackDTO.vnp_TxnRef,
                    PaymentId = vnPayCallbackDTO.vnp_TransactionNo,
                    TransactionId = vnPayCallbackDTO.vnp_TransactionNo,
                    Token = vnpSecureHash,
                    VnPayResponseCode = vnPayCallbackDTO.vnp_ResponseCode,
                    TxnRef = vnPayCallbackDTO.vnp_TxnRef
                };
            }

            // ❌ Giao dịch thất bại
            return new PaymentResponseDTO
            {
                Success = false,
                PaymentMethod = "VnPay",
                OrderDescription = vnPayCallbackDTO.vnp_OrderInfo,
                OrderId = vnPayCallbackDTO.vnp_TxnRef,
                PaymentId = vnPayCallbackDTO.vnp_TransactionNo,
                TransactionId = vnPayCallbackDTO.vnp_TransactionNo,
                Token = vnpSecureHash,
                VnPayResponseCode = vnPayCallbackDTO.vnp_ResponseCode,
                TxnRef = vnPayCallbackDTO.vnp_TxnRef
            };
        }

        public async Task<string> CreateInvoicePaymentUrl(Guid invoiceId)
        {
            // Lấy invoice từ database
            var invoice = await _unitOfWork.InvoiceRepository.GetByIdAsync(invoiceId);

            // Kiểm tra tồn tại
            if (invoice == null)
                throw new Exception("Invoice not found.");

            // Kiểm tra trạng thái (nếu cần, ví dụ chưa thanh toán)
            if (invoice.PaymentStatus == PaymentStatusEnum.Paid)
                throw new Exception("Invoice is already paid.");

            // Tạo thông tin thanh toán
            var paymentInfo = new PaymentInformationDTO
            {
                Amount = invoice.TotalAmount,
                OrderDescription = $"Thanh toán hóa đơn khám bệnh #{invoiceId}",
                OrderType = "healthcare", // hoặc mã theo chuẩn VNPAY như: "billpayment"
                Name = "User patient", // hoặc DoctorName tùy ngữ cảnh
                InvoiceId = invoiceId // Thêm property này vào DTO nếu chưa có
            };

            // Tạo URL thanh toán
            var paymentUrl = CreatePaymentUrl(paymentInfo, _httpContextAccessor.HttpContext);

            return paymentUrl;
        }




        //public async Task<ApiResponse<string>> CreatePaymentUrl(Guid invoiceId)
        //{
        //    var invoice = await _unitOfWork.InvoiceRepository.GetByIdAsync(invoiceId);

        //    if (invoice == null)
        //        return ResponseHandler.Failure<string>("Hóa đơn không tồn tại");

        //    try
        //    {
        //        var vnPay = new VnPayLibrary();
        //        string orderId = invoice.InvoiceId.ToString();
        //        string amount = (invoice.TotalAmount * 100).ToString();

        //        string createDate = _currentTime.GetCurrentTime().ToString("yyyyMMddHHmmss");

        //        vnPay.AddRequestData("vnp_Version", "2.1.0");
        //        vnPay.AddRequestData("vnp_Command", "pay");
        //        vnPay.AddRequestData("vnp_TmnCode", _vnPayConfig.TmnCode);
        //        vnPay.AddRequestData("vnp_Amount", amount);
        //        vnPay.AddRequestData("vnp_CreateDate", createDate);
        //        vnPay.AddRequestData("vnp_CurrCode", "VND");
        //        vnPay.AddRequestData("vnp_IpAddr", GetIpAddress() ?? "127.0.0.1");
        //        vnPay.AddRequestData("vnp_Locale", "vn");
        //        vnPay.AddRequestData("vnp_OrderInfo", $"Thanh toán hóa đơn {orderId}");
        //        vnPay.AddRequestData("vnp_OrderType", "billpayment");
        //        vnPay.AddRequestData("vnp_ReturnUrl", _vnPayConfig.ReturnUrl);
        //        vnPay.AddRequestData("vnp_TxnRef", orderId);

        //        string paymentUrl = vnPay.CreateRequestUrl(_vnPayConfig.PaymentUrl, _vnPayConfig.HashSecret);

        //        return ResponseHandler.Success(paymentUrl, "Tạo URL thanh toán thành công.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return ResponseHandler.Failure<string>($"Lỗi tạo URL thanh toán: {ex.Message}");
        //    }
        //}


        //public async Task<PaymentResult> CreatePaymentUrlCallback(VnPayCallbackDTO dto)
        //{
        //    // 1. Lấy secret từ cấu hình
        //    string hashSecret = _configuration["VnPay:HashSecret"];

        //    // 2. Tạo danh sách để xác thực hash
        //    var responseData = new SortedList<string, string>();
        //    foreach (var prop in dto.GetType().GetProperties())
        //    {
        //        string name = prop.Name;
        //        var value = prop.GetValue(dto)?.ToString();
        //        if (!string.IsNullOrEmpty(value) && name.StartsWith("vnp_") && name != "vnp_SecureHash" && name != "vnp_BankCode")
        //        {
        //            responseData.Add(name, value);
        //        }
        //    }
        //    var rawData = string.Join("&", responseData.Select(kv => $"{CustomVnPayUrlEncode(kv.Key)}={CustomVnPayUrlEncode(kv.Value)}"));

        //    string computedHash = ComputeHmacSha512(hashSecret, rawData);
        //    // ✅ Thêm dòng này ngay tại đây
        //    Console.WriteLine("RawData: " + rawData);
        //    Console.WriteLine("HashSerect: " + hashSecret);
        //    Console.WriteLine("ComputedHash: " + computedHash);
        //    Console.WriteLine("ReceivedHash: " + dto.vnp_SecureHash);

        //    // 5. So sánh secure hash
        //    if (!computedHash.Equals(dto.vnp_SecureHash, StringComparison.InvariantCultureIgnoreCase))
        //    {
        //        return new PaymentResult
        //        {
        //            IsSuccess = false,
        //            OrderId = dto.vnp_TxnRef,
        //            Message = "Invalid hash - dữ liệu không hợp lệ"
        //        };
        //    }

        //    // 6. Kiểm tra mã giao dịch thành công
        //    if (dto.vnp_ResponseCode == "00" && dto.vnp_TransactionStatus == "00")
        //    {
        //        var invoiceId = Guid.Parse(dto.vnp_TxnRef); // Lưu ý: cần chắc chắn định dạng là Guid
        //        var invoice = await _unitOfWork.InvoiceRepository.GetByIdAsync(invoiceId);

        //        if (invoice != null)
        //        {
        //            invoice.PaymentStatus = Enums.PaymentStatusEnum.Paid; // Hoặc enum nếu bạn dùng Enum
        //            invoice.InvoiceDate = _currentTime.GetCurrentTime();

        //            await _unitOfWork.InvoiceRepository.UpdateAsync(invoice);
        //            await _unitOfWork.SaveChangeAsync();
        //        }
        //        return new PaymentResult
        //        {
        //            IsSuccess = true,
        //            OrderId = dto.vnp_TxnRef,
        //            Message = "Thanh toán thành công"
        //        };
        //    }
        //    else
        //    {
        //        return new PaymentResult
        //        {
        //            IsSuccess = false,
        //            OrderId = dto.vnp_TxnRef,
        //            Message = "Thanh toán thất bại"
        //        };
        //    }
        //}
        private string CustomVnPayUrlEncode(string input)
        {
            return WebUtility.UrlEncode(input)
                .Replace("+", "%20")
                .Replace("*", "%2A")
                .Replace("%7E", "~");
        }
        private string ComputeHmacSha512(string key, string data)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] dataBytes = Encoding.UTF8.GetBytes(data);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashBytes = hmac.ComputeHash(dataBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
        private string GetIpAddress()
        {
            return _httpContextAccessor?.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        }
    }
}
