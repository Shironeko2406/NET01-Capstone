using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.Entity
{
    public class Appointment
    {
        [Key]
        public Guid AppointmentId { get; set; }

        // FK -> Users (Patient)
        [Required]
        public Guid PatientId { get; set; }

        [ForeignKey(nameof(PatientId))]
        public Users Patient { get; set; }

        // FK -> Users (Doctor)
        [Required]
        public Guid DoctorId { get; set; }

        [ForeignKey(nameof(DoctorId))]
        public Users Doctor { get; set; }

        // FK -> Specialties
        [Required]
        public Guid SpecialtyId { get; set; }

        [ForeignKey(nameof(SpecialtyId))]
        public Specialties Specialty { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public TimeSpan AppointmentTime { get; set; }

        public string? Note { get; set; }

        public AppointmentStatusEnum Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

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
