using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.DTO.UsersDTO
{
    public class RegisterPatientDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public GenderEnum Gender { get; set; } 
        public string Address { get; set; }
        public string? Avatar { get; set; }
        public DateTime DateOfBirth { get; set; }
    }
}
