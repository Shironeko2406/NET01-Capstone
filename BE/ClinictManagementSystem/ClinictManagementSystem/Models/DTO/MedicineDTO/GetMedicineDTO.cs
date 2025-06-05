using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.MedicineDTO
{
    public class GetMedicineFilterDTO
    {
        public Guid MedicineId { get; set; }
        public string MedicineCode { get; set; } 
        public string Name { get; set; }
        public Guid MedicineTypeId { get; set; }
        public string MedicineTypeName { get; set; }

        public MedicineUnitTypeEnum Unit { get; set; }
        public int Price { get; set; }

        public int StockQuantity { get; set; }
        public int MinQuantity { get; set; }
        public MedicineStatusEnum Status { get; set; } 
    }
}
