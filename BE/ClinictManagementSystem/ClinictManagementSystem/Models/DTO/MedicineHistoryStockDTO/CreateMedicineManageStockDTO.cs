using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO
{
    public class CreateMedicineManageStockDTO
    {
        public Guid MedicineId { get; set; }
        public int Quantity { get; set; }
        public string? Note { get; set; }
        public MedicineStockHistoryTypeEnum Type { get; set; }
    }
}
