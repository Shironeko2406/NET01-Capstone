using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Medicines
    {
        [Key]
        public Guid MedicineId { get; set; }

        public string Name { get; set; }
        public string Unit { get; set; }
        public int Price { get; set; }
        public int StockQuantity { get; set; }

        public ICollection<PrescriptionDetails> PrescriptionDetails { get; set; }
    }
}
