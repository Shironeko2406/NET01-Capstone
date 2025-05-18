using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.UsersDTO
{
    public class UpdateUserDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public DateTime DateOfBirth { get; set; }
        public GenderEnum Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
    }
}
