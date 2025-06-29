using ClinictManagementSystem.Models.DTO.PrescriptionDetailsDTO;

namespace ClinictManagementSystem.Models.DTO.PrescriptionDTO
{
    public class GetPrescriptionDTO
    {
        public Guid PrescriptionId { get; set; }
        public string Notes { get; set; }
        public List<GetPrescriptionDetailDTO> PrescriptionDetails { get; set; }
    }
}
