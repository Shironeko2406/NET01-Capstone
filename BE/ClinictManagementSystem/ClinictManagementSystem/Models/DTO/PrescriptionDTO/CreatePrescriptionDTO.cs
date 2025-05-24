using ClinictManagementSystem.Models.DTO.PrescriptionDetailsDTO;

namespace ClinictManagementSystem.Models.DTO.PrescriptionDTO
{
    public class CreatePrescriptionDTO
    {
        public Guid AppointmentId { get; set; }
        public Guid DoctorId { get; set; }
        public string Notes { get; set; }
        public List<PrescriptionDetailDTO> Medicines { get; set; }
    }
}
