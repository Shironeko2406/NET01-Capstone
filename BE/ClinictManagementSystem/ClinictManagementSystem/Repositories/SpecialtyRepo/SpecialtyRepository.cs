using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.ServiceRepo;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.SpecialtyRepo
{
    public class SpecialtyRepository : GenericRepository<Specialties>, ISpecialtyRepository
    {
        private readonly AppDbContext _dbContext;

        public SpecialtyRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<List<Specialties>> GetSpecialtiesByDoctorIdAsync(Guid doctorId)
        {
            return await _dbContext.Specialties
                .Include(s => s.DoctorSpecialties)
                .Where(s => !s.IsDeleted && s.DoctorSpecialties.Any(ds => ds.DoctorId == doctorId))
                .ToListAsync();
        }
    }
}
