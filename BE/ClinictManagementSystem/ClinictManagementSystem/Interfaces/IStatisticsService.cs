using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.StatisticDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IStatisticsService
    {
        Task<ApiResponse<AppointmentStatisticsDTO>> GetAppoinmentStatistic();
        Task<ApiResponse<RevenueOverviewDTO>> GetRevenueOverview(FilterTimeTotalRevenueDTO filterTimeTotalRevenueDTO);
        Task<ApiResponse<List<MonthlyRevenueDataDTO>>> GetMonthlyRevenueLast6Months();
        Task<ApiResponse<List<RevenueSourceAnalysisDTO>>> GetRevenueBySource();
        Task<ApiResponse<List<TopServiceRevenueDTO>>> GetTopServiceRevenues();
        Task<ApiResponse<List<TopMedicineSoldDTO>>> GetTopMedicinesSold();

    }
}
