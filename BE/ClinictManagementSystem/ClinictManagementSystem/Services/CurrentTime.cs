using ClinictManagementSystem.Interfaces;

namespace ClinictManagementSystem.Services
{
    public class CurrentTime : ICurrentTime
    {
        public DateTime GetCurrentTime()
        {
            var vietnamTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var currentTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vietnamTimeZone);

            return currentTime;
        }
    }
}
