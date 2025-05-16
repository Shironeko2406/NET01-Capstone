using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;

namespace ClinictManagementSystem.Repositories.MedicineStockHistoryRepo
{
    public class MedicineStockHistoryRepository : GenericRepository<MedicineStockHistory>, IMedicineStockHistoryRepository
    {
        public MedicineStockHistoryRepository(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
        }
    }
}
