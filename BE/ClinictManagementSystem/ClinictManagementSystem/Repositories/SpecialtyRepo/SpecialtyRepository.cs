using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.ServiceRepo;

namespace ClinictManagementSystem.Repositories.SpecialtyRepo
{
    public class SpecialtyRepository : GenericRepository<Specialties>, ISpecialtyRepository
    {
        public SpecialtyRepository(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
        }
    }
}
