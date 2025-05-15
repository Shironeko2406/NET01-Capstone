using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;

namespace ClinictManagementSystem.Repositories.MedicineRepo
{
    public class MedicineRepocitory : GenericRepository<Medicines>, IMedicineRepocitory
    {
        public MedicineRepocitory(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
        }
    }
}
