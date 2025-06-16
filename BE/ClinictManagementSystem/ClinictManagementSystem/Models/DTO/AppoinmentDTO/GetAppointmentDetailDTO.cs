using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;
using ClinictManagementSystem.Models.DTO.PrescriptionDTO;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class GetAppointmentDetailDTO
    {
        // Thông tin lịch hẹn
        public Guid AppointmentId { get; set; }
        public string AppointmentCode { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public AppointmentStatusEnum Status { get; set; }
        public string? Note { get; set; }
        public string? Symptoms { get; set; }
        public string? GeneralConclusion { get; set; }

        // Thông tin bệnh nhân
        public Guid PatientId { get; set; }
        public string PatientName { get; set; }
        public string? PatientPhone { get; set; }
        public GenderEnum? PatientGender { get; set; }
        public DateTime? PatientDob { get; set; }

        // Thông tin bác sĩ
        public Guid DoctorId { get; set; }
        public string DoctorName { get; set; }
        public string? DoctorAvatar { get; set; }

        // Thông tin chuyên khoa
        public string SpecialtyName { get; set; }

        // Danh sách dịch vụ đã đặt trong cuộc hẹn
        public List<AppointmentServiceDetailDTO> Services { get; set; }
        public GetPrescriptionDTO? Prescription { get; set; }
    }
}
