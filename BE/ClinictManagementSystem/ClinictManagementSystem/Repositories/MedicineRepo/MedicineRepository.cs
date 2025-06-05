using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;

namespace ClinictManagementSystem.Repositories.MedicineRepo
{
    public class MedicineRepository : GenericRepository<Medicines>, IMedicineRepository
    {
        public MedicineRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
        }
    }
}
