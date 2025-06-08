using System.Globalization;

namespace ClinictManagementSystem.Helper
{
    public static class DateTimeFormatterHelper
    {
        public static string ToVietnameseDayOfWeek(DateTime date)
        {
            var culture = new CultureInfo("vi-VN");
            return culture.TextInfo.ToTitleCase(date.ToString("dddd, dd/MM/yyyy", culture));
        }
    }
}
