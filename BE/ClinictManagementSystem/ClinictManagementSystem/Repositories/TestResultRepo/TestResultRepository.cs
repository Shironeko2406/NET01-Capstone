using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.TestResultRepo
{
    public class TestResultRepository : GenericRepository<TestResult>, ITestResultRepository
    {
        private readonly AppDbContext _dbContext;
        public TestResultRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }
    }
}
