using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.ServiceRepo
{
    public class ServiceRepository : GenericRepository<Service>, IServiceRepository
    {
        public ServiceRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
        }
    }
}
