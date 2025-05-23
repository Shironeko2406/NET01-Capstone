using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ClinictManagementSystem.Models.Entity
{
    public class DoctorSchedule : BaseEntity
    {
        [Key]
        public Guid ScheduleId { get; set; }
        public Guid DoctorId { get; set; }  
        [ForeignKey("DoctorId")]
        public Users Doctor { get; set; }  
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
