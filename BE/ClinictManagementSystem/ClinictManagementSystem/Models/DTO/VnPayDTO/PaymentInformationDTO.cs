namespace ClinictManagementSystem.Models.DTO.VnPayDTO
{
    public class PaymentInformationDTO
    {
        public Guid InvoiceId { get; set; }           // ID hóa đơn lịch khám
        public string OrderType { get; set; }         // Loại đơn hàng, ví dụ: "medical"
        public double Amount { get; set; }            // Số tiền cần thanh toán
        public string OrderDescription { get; set; }  // Mô tả hóa đơn: "Thanh toán khám bệnh..."
        public string Name { get; set; }              // Tên bệnh nhân hoặc người thanh toán

    }
}
