using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;

        public StatisticsService(IUnitOfWork unitOfWork, ICurrentTime currentTime)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
        }
        public async Task<ApiResponse<AppointmentStatisticsDTO>> GetAppoinmentStatistic()
        {
            try
            {
                var today = _currentTime.GetCurrentTime();
                var appointmentRepo = _unitOfWork.AppoinmentRepository;

                var booked = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Booked);
                var waiting = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Waiting);
                var inProgress = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.InProgress);
                var completed = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Completed);
                var cancelled = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Cancelled);
                var todayCount = await appointmentRepo.CountTodayAsync(today);
                int total = await appointmentRepo.CountAsync();
                var patientCount = total - cancelled;
                double completionRate = total > 0 ? Math.Round((double)completed / total * 100, 2) : 0;
                var dto = new AppointmentStatisticsDTO
                {
                    Total = total,
                    BookedCount = booked,
                    WaitingCount = waiting,
                    InProgressCount = inProgress,
                    CompletedCount = completed,
                    CancelledCount = cancelled,
                    TodayCount = todayCount,
                    CompletionRate = completionRate,
                    PatientCount = patientCount
                };

                return ResponseHandler.Success(dto);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<AppointmentStatisticsDTO>($"Error: {ex.Message}");
            }
        }

    }
}
