using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.AppointmentServicesDTO
{
    public class AppointmentServiceResponseDTO
    {
        public Guid Id { get; set; }
        public Guid ServiceId { get; set; }
        public string ServiceName { get; set; }
        public string Note { get; set; }
        public AppointmentServiceStatusEnum Status { get; set; }
    }
}
