using ClinictManagementSystem.Models.Entity;

namespace ClinictManagementSystem.Repositories.DoctorSpecialtyRepo
{
    public interface IDoctorSpecialtyRepository
    {
        Task AddDoctorSpecialtyAsync(DoctorSpecialties doctorSpecialty);
        Task AddRangeAsync(List<DoctorSpecialties> entities);
        void HardRemoveRange(List<DoctorSpecialties> entities);
    }
}
