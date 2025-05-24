using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class PrescriptionDetails : BaseEntity
    {
        [Key]
        public Guid Id { get; set; }

        public Guid PrescriptionId { get; set; }
        [ForeignKey("PrescriptionId")]
        public Prescription Prescription { get; set; }

        public Guid MedicineId { get; set; }
        [ForeignKey("MedicineId")]
        public Medicines Medicine { get; set; }

        public int Quantity { get; set; }
        public string DosageInstructions { get; set; }
    }
}
