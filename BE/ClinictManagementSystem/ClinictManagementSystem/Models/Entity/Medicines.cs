using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinictManagementSystem.Models.Entity
{
    public class Medicines : BaseEntity
    {
        [Key]
        public Guid MedicineId { get; set; }
        public Guid MedicineTypeId { get; set; }
        [ForeignKey("MedicineTypeId")]
        public MedicineType MedicineType { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public MedicineUnitTypeEnum Unit { get; set; }
        public int Price { get; set; }
        public int StockQuantity { get; set; }
        public int MinQuantity { get; set; }
        public ICollection<PrescriptionDetails> PrescriptionDetails { get; set; }
        public ICollection<MedicineStockHistory> MedicineStockHistory { get; set; }
    }
}
