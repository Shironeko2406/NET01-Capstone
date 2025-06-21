using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class FilterAppointmentLabTechDTO
    {
        public string? Search { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public AppointmentStatusEnum? Status { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
