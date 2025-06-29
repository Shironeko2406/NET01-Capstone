using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/statistic")]
    [ApiController]
    public class StatisticController : ControllerBase
    {
        private readonly IStatisticsService _statisticsService;

        public StatisticController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }

        [SwaggerOperation(Summary = "Lấy thống kế lịch hẹn: Receptionist")]
        //[Authorize(Roles = AppRole.Receptionist)]
        [HttpGet("appointment")]
        public async Task<ApiResponse<AppointmentStatisticsDTO>> GetAppoinmentStatistic()
        {
            return await _statisticsService.GetAppoinmentStatistic();
        }

        [SwaggerOperation(Summary = "Lấy thống kê doanh thu tổng quan: Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("revenue-overview")]
        public async Task<ApiResponse<RevenueOverviewDTO>> GetRevenueOverview([FromQuery]FilterTimeTotalRevenueDTO filterTimeTotalRevenueDTO)
        {
            return await _statisticsService.GetRevenueOverview(filterTimeTotalRevenueDTO);
        }

        [SwaggerOperation(Summary = "Lấy biểu đồ doanh thu 6 tháng gần nhất: Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("monthly-revenue")]
        public async Task<ApiResponse<List<MonthlyRevenueDataDTO>>> GetMonthlyRevenueLast6Months()
        {
            return await _statisticsService.GetMonthlyRevenueLast6Months();
        }

        [SwaggerOperation(Summary = "Phân tích doanh thu theo nguồn: Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("revenue-by-source")]
        public async Task<ApiResponse<List<RevenueSourceAnalysisDTO>>> GetRevenueBySource()
        {
            return await _statisticsService.GetRevenueBySource();
        }

        [SwaggerOperation(Summary = "Top 5 dịch vụ xét nghiệm doanh thu cao nhất: Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("top-services")]
        public async Task<ApiResponse<List<TopServiceRevenueDTO>>> GetTopServiceRevenues()
        {
            return await _statisticsService.GetTopServiceRevenues();
        }

        [SwaggerOperation(Summary = "Top 5 thuốc bán chạy nhất: Admin")]
        [Authorize(Roles = AppRole.Admin)]
        [HttpGet("top-medicines")]
        public async Task<ApiResponse<List<TopMedicineSoldDTO>>> GetTopMedicinesSold()
        {
            return await _statisticsService.GetTopMedicinesSold();
        }

    }
}
