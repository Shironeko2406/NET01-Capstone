using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class FilterAppoinmentByDoctorLoginDTO
    {
        public string? Search { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public SortEnum? SortBy { get; set; }
        public Guid? specialtyId { get; set; }
        public AppointmentStatusEnum? AppointmentStatusEnum { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
