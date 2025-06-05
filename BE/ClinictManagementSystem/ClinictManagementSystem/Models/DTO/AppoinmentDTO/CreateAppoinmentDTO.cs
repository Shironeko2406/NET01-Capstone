using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Models.Entity;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class CreateAppoinmentDTO
    {
        public Guid DoctorId { get; set; }
        public Guid SpecialtyId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string? Note { get; set; }


    }
}
