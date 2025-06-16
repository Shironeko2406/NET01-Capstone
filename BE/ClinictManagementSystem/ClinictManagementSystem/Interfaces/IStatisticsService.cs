using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.StatisticDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IStatisticsService
    {
        Task<ApiResponse<AppointmentStatisticsDTO>> GetAppoinmentStatistic();

    }
}
