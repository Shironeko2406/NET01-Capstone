namespace ClinictManagementSystem.Models.DTO.VnPayDTO
{
    public class PaymentResult
    {
        public bool IsSuccess { get; set; }
        public string OrderId { get; set; }
        public string Message { get; set; }
    }
}
