using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.PrescriptionDetailsRepo
{
    public class PrescriptionDetailsRepository : GenericRepository<PrescriptionDetails>, IPrescriptionDetailsRepository
    {
        private readonly AppDbContext _dbContext;
        public PrescriptionDetailsRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }
    }
}
