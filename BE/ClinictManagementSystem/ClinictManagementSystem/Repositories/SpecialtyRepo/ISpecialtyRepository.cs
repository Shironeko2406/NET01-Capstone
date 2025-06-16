using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.SpecialtyRepo
{
    public interface ISpecialtyRepository : IGenericRepository<Specialties>
    {
        Task<List<Specialties>> GetSpecialtiesByDoctorIdAsync(Guid doctorId);
    }
}
