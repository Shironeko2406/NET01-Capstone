using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Specialties :BaseEntity
    {
        [Key]
        public Guid SpecialtyId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<DoctorSpecialties> DoctorSpecialties { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
