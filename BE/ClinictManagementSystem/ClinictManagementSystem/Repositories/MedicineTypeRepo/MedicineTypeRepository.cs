using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;

namespace ClinictManagementSystem.Repositories.MedicineTypeRepo
{
    public class MedicineTypeRepository : GenericRepository<MedicineType>, IMedicineTypeRepository
    {
        public MedicineTypeRepository(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
        }
    }
}
