namespace ClinictManagementSystem.Models.DTO.EmailDTO
{
    public class RegisterAndAppointmentEmailDTO
    {
        public string ToEmail { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string DoctorName { get; set; }
        public string SpecialtyName { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string AppointmentCode { get; set; }

    }
}
