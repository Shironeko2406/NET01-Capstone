using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Users
    {
        [Key]
        public Guid UserId { get; set; }

        public string FullName { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public GenderEnum Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public UserStatusEnum Status { get; set; }

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Appointment> AppointmentsAsPatient { get; set; }
        public ICollection<Appointment> AppointmentsAsDoctor { get; set; }
        public ICollection<Prescription> Prescriptions { get; set; }
        public ICollection<DoctorSpecialties> DoctorSpecialties { get; set; }
    }
}
