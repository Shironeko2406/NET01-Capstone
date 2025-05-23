using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class GetAppointmentDTO
    {
        public Guid AppointmentId { get; set; }
        public string AppointmentCode { get; set; }

        // Thông tin lịch hẹn
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public AppointmentStatusEnum Status { get; set; }

        // Thông tin bác sĩ
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string? DoctorAvatar { get; set; }

        // Thông tin chuyên khoa
        public string SpecialtyName { get; set; }
    }
}
