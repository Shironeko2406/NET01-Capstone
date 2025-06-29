namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class FilterTimeTotalRevenueDTO
    {
        public DateTime StartTime { get; set; } = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
        public DateTime EndTime { get; set; } = DateTime.Now;

    }
}
