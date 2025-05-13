using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class TestResult
    {
        [Key]
        public Guid TestResultId { get; set; }

        public Guid AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

        public Guid ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public Service Service { get; set; }

        public string Result { get; set; }
        public DateTime ResultDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
