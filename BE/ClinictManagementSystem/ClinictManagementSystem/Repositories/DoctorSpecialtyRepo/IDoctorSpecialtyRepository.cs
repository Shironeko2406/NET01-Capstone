using ClinictManagementSystem.Models.Entity;

namespace ClinictManagementSystem.Repositories.DoctorSpecialtyRepo
{
    public interface IDoctorSpecialtyRepository
    {
        Task AddDoctorSpecialtyAsync(DoctorSpecialties doctorSpecialty);
    }
}
