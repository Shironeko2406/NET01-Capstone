using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.Entity
{
    public class Appointment : BaseEntity
    {
        [Key]
        public Guid AppointmentId { get; set; }

        [Required]
        public Guid PatientId { get; set; }

        [ForeignKey(nameof(PatientId))]
        public Users Patient { get; set; }

        [Required]
        public Guid DoctorId { get; set; }

        [ForeignKey(nameof(DoctorId))]
        public Users Doctor { get; set; }

        [Required]
        public Guid SpecialtyId { get; set; }

        [ForeignKey(nameof(SpecialtyId))]
        public Specialties Specialty { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public string? Note { get; set; }

        public AppointmentStatusEnum Status { get; set; }

        // Relationship: One appointment can have many prescriptions
        public ICollection<Prescription> Prescriptions { get; set; } 

        // Relationship: One appointment can have many test results
        public ICollection<TestResult> TestResults { get; set; } 

        // Relationship: One appointment can have many services
        public ICollection<AppointmentServices> AppointmentServices { get; set; } 

        // Relationship: One appointment has one invoice
        public Invoice? Invoice { get; set; }
    }
}
