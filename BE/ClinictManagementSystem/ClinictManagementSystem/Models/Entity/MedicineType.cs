using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class MedicineType : BaseEntity
    {
        [Key]
        public Guid MedicineTypeId { get; set; }
        public string Name { get; set; }
        public ICollection<Medicines> Medicines { get; set; }
    }
}
