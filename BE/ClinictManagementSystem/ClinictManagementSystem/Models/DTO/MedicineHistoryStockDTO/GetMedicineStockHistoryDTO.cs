using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO
{
    public class GetMedicineStockHistoryDTO
    {
        public Guid MedicineStockHistoryId { get; set; }
        public Guid MedicineId { get; set; }
        public string MedicineName { get; set; }
        public string MedicineCode { get; set; }
        public string? TransactionCode { get; set; }
        public int Quantity { get; set; }
        public MedicineStockHistoryTypeEnum Type { get; set; }
        public string? Note { get; set; }
        public DateTime CreationDate { get; set; }
        public string? CreatedByName { get; set; } // nếu join User
    }
}
