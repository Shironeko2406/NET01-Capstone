using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinictManagementSystem.Models.Entity
{
    public class MedicineStockHistory : BaseEntity
    {
        [Key]
        public Guid MedicineStockHistoryId { get; set; }
        public Guid MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicines Medicine { get; set; }
        public int Quantity { get; set; }       
        public MedicineStockHistoryTypeEnum Type { get; set; }       
        public string? Note { get; set; }
        //public string? ImportedBy { get; set; }   
    }
}
