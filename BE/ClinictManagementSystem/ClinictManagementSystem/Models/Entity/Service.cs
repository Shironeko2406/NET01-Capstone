using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Service : BaseEntity
    {
        [Key]
        public Guid ServiceId { get; set; }

        public string Name { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public ICollection<TestResult> TestResults { get; set; }
        public ICollection<AppointmentServices> AppointmentServices { get; set; }
    }
}
