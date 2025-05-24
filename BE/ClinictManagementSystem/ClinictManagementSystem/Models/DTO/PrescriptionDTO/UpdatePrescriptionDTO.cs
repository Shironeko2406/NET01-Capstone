using ClinictManagementSystem.Models.DTO.PrescriptionDetailsDTO;

namespace ClinictManagementSystem.Models.DTO.PrescriptionDTO
{
    public class UpdatePrescriptionDTO
    {
        public string? Notes { get; set; }
        public List<PrescriptionDetailDTO> Medicines { get; set; }
    }
}
