namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class MonthlyRevenueDataDTO
    {
        public string Month { get; set; }
        public int Total { get; set; }
        public int Appointments { get; set; }
        public int Medicine { get; set; }
        public int Tests { get; set; }
    }
}
