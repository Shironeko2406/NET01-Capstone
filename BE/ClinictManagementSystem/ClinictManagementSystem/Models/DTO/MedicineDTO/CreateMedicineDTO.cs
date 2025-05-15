using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.DTO.MedicineDTO
{
    public class CreateMedicineDTO
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public Guid MedicineTypeId { get; set; }
        public MedicineUnitTypeEnum Unit { get; set; }
        public int Price { get; set; }
        public int StockQuantity { get; set; }
        public int MinQuantity { get; set; }
    }
}
