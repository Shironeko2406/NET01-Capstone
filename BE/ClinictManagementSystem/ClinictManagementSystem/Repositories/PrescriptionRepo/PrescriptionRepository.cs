using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.PrescriptionRepo
{
    public class PrescriptionRepository : GenericRepository<Prescription>, IPrescriptionRepository
    {
        private readonly AppDbContext _dbContext;
        public PrescriptionRepository(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
            _dbContext = context;
        }
    }
}
