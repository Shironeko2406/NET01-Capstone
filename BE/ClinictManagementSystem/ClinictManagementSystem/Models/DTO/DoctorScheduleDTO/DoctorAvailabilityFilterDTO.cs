using ClinictManagementSystem.Models.Entity;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinictManagementSystem.Models.DTO.DoctorScheduleDTO
{
    public class DoctorAvailabilityFilterDTO
    {
        public Guid SpecialtyId { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
