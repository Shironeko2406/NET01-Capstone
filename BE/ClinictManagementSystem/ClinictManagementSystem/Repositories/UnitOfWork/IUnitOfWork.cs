using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;
using ClinictManagementSystem.Repositories.UsersRepo;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IUsersRepository UsersRepository { get; }
        public IServiceRepository ServiceRepository { get; }
        public ISpecialtyRepository SpecialtyRepository { get; }
        public IMedicineTypeRepository MedicineTypeRepository { get; }
        public IMedicineRepository MedicineRepository { get; }
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository { get; }
        public Task<int> SaveChangeAsync();
    }
}
