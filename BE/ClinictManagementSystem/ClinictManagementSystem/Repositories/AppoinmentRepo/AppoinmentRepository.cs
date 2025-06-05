using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineRepo;

namespace ClinictManagementSystem.Repositories.AppoinmentRepo
{
    public class AppoinmentRepository : GenericRepository<Appointment>, IAppoinmentRepository
    {
        public AppoinmentRepository(
            AppDbContext context,
            ICurrentTime timeService,
            IClaimsService claimsService) 
            : base(context, timeService, claimsService)
        {
        }
    }
}
