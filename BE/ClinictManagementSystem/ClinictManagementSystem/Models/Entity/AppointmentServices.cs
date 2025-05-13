using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.Entity
{
    public class AppointmentServices
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("Appointment")]
        public Guid AppointmentId { get; set; }

        [ForeignKey("Service")]
        public Guid ServiceId { get; set; }

        public AppointmentServiceStatusEnum IsCompleted { get; set; }
        public string Note { get; set; }

        public Appointment Appointment { get; set; }
        public Service Service { get; set; }
    }
}
