using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class FilterAppointmentAdminDTO
    {
        public string? Search { get; set; } 
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public AppointmentStatusEnum? Status { get; set; }

        public Guid? DoctorId { get; set; }
        public Guid? PatientId { get; set; }
        public Guid? SpecialtyId { get; set; }

        public SortEnum? SortBy { get; set; } 
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
