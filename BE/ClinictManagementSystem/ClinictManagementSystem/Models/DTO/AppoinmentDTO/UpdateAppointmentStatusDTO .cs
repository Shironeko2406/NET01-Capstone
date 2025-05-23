using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppoinmentDTO
{
    public class UpdateAppointmentStatusDTO
    {
        public Guid AppointmentId { get; set; }
        public AppointmentStatusEnum Status { get; set; }
    }
}
