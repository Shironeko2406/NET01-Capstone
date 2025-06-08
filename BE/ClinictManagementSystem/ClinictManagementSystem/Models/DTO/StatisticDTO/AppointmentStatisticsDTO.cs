namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class AppointmentStatisticsDTO
    {
        public int BookedCount { get; set; }
        public int WaitingCount { get; set; }
        public int InProgressCount { get; set; }
        public int CompletedCount { get; set; }
        public int CancelledCount { get; set; }
        public int TodayCount { get; set; }
        public double CompletionRate { get; set; }
    }
}
