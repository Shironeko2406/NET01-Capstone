using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.UsersDTO
{
    public class CreateUserAccountInternalDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public GenderEnum Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string? Avatar { get; set; }
        public string RoleName { get; set; } // "Doctor" hoặc "Receptionist"
        public List<Guid>? SpecialtyIds { get; set; } // chỉ áp dụng khi RoleName == "Doctor"
    }
}
