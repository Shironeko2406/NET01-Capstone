namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class RevenueOverviewDTO
    {
        public int TotalRevenue { get; set; }
        public int TotalAppointments { get; set; }
        public double AverageRevenuePerAppointment { get; set; }
        public int TotalMedicinesSold { get; set; }
    }
}
