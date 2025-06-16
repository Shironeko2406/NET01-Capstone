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
    }
}
