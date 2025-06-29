using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class TopMedicineSoldDTO
    {
        public string MedicineName { get; set; }
        public int Revenue { get; set; }
        public int Quantity { get; set; }
        public MedicineUnitTypeEnum Unit { get; set; }
    }
}
