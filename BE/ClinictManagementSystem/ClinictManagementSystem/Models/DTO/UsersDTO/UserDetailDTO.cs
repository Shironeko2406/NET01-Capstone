namespace ClinictManagementSystem.Models.DTO.UsersDTO
{
    public class UserDetailDTO
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string? Avatar { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public List<string> Roles { get; set; } 
        public List<string> Specialties { get; set; }
    }
}
