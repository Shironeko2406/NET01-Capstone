using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class TestResult : BaseEntity
    {
        [Key]
        public Guid TestResultId { get; set; }

        [ForeignKey("AppointmentService")]
        public Guid AppointmentServiceId { get; set; }

        public AppointmentServices AppointmentService { get; set; }

        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public Guid? UpdateBy { get; set; }
        [ForeignKey("UpdateBy")]
        public Users? UpdatedByUser { get; set; }
    }
}
