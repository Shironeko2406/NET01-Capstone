using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class DoctorScheduleService : IDoctorScheduleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DoctorScheduleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task CreateDefaultScheduleAsync(Guid doctorId)
        {
            var schedules = new List<DoctorSchedule>();

            for (var day = DayOfWeek.Monday; day <= DayOfWeek.Friday; day++)
            {
                schedules.Add(new DoctorSchedule
                {
                    ScheduleId = Guid.NewGuid(),
                    DoctorId = doctorId,
                    DayOfWeek = day,
                    StartTime = new TimeSpan(8, 0, 0),
                    EndTime = new TimeSpan(17, 0, 0),
                });
            }

            await _unitOfWork.DoctorScheduleRepository.AddRangeAsync(schedules);
        }
    }
}
