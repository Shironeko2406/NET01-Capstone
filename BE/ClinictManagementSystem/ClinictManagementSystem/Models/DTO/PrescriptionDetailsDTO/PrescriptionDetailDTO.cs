namespace ClinictManagementSystem.Models.DTO.PrescriptionDetailsDTO
{
    public class PrescriptionDetailDTO
    {
        public Guid MedicineId { get; set; }
        public int Quantity { get; set; }
        public string DosageInstructions { get; set; }
    }
}
