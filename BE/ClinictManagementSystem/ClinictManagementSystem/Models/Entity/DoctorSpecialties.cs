using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class DoctorSpecialties
    {
        [Key]
        public Guid Id { get; set; }

        public Guid DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public Users Doctor { get; set; }

        public Guid SpecialtyId { get; set; }
        [ForeignKey("SpecialtyId")]
        public Specialties Specialty { get; set; }
    }
}
