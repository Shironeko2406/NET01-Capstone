using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IServiceRepository ServiceRepository { get; }
        public ISpecialtyRepository SpecialtyRepository { get; }
        public IMedicineTypeRepository MedicineTypeRepository { get; }
        public IMedicineRepocitory MedicineRepocitory { get; }
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository { get; }
        public Task<int> SaveChangeAsync();
    }
}
