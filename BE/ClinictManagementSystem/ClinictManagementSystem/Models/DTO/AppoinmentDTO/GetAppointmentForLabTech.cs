using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class GetAppointmentForLabTech
    {
        public Guid AppointmentId { get; set; }
        public string AppointmentCode { get; set; }

        // Thông tin lịch hẹn
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public AppointmentStatusEnum Status { get; set; }
        public LabTestStatusEnum LabTestStatus { get; set; }

        // Thông tin bệnh nhân
        public Guid PatientId { get; set; }
        public string PatientName { get; set; }

        //Thông tin bác sĩ
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; }

        // Thông tin chuyên khoa
        public string SpecialtyName { get; set; }
        public List<AppointmentServiceDetailDTO> Services { get; set; }

    }
}
