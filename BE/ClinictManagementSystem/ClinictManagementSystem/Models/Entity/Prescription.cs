using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Prescription
    {
        [Key]
        public Guid PrescriptionId { get; set; }

        public Guid AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

        public Guid DoctorId { get; set; }
        [ForeignKey("DoctorId")]
        public Users Doctor { get; set; }

        public DateTime CreatedAt { get; set; }
        public string Notes { get; set; }

        public ICollection<PrescriptionDetails> PrescriptionDetails { get; set; }
    }
}
