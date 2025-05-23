namespace ClinictManagementSystem.Interfaces
{
    public interface IDoctorScheduleService
    {
        Task CreateDefaultScheduleAsync(Guid doctorId);
    }
}
