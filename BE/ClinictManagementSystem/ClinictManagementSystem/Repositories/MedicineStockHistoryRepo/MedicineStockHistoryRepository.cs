using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Services;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.MedicineStockHistoryRepo
{
    public class MedicineStockHistoryRepository : GenericRepository<MedicineStockHistory>, IMedicineStockHistoryRepository
    {
        private readonly AppDbContext _dbContext;
        private readonly ICurrentTime _timeService;

        public MedicineStockHistoryRepository(
            AppDbContext context,
            ICurrentTime timeService,
            IClaimsService claimsService)
            : base(context, timeService, claimsService)
        {
            _dbContext = context;
            _timeService = timeService;
        }

        public async Task AddRangeMedicineStockHistoryAsync(List<MedicineStockHistory> entities)
        {
            foreach (var entity in entities)
            {
                entity.CreationDate = _timeService.GetCurrentTime();
            }
            await _dbContext.AddRangeAsync(entities);
        }
    }
}
