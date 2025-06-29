using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.PrescriptionDetailsDTO
{
    public class GetPrescriptionDetailDTO
    {
        public Guid MedicineId { get; set; }
        public string MedicineName { get; set; }
        public int Quantity { get; set; }
        public string? DosageInstructions { get; set; }
        public MedicineUnitTypeEnum? Unit { get; set; }
        public int Price { get; set; }

    }
}
