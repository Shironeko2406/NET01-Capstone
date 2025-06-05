namespace ClinictManagementSystem.Models.DTO.DoctorScheduleDTO
{
    public class DoctorGetDTO
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; }
        public string? Avatar { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Specialties { get; set; }
    }
}
