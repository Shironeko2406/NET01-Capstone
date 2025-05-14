using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IServiceRepository ServiceRepository { get; }
        public ISpecialtyRepository SpecialtyRepository { get; }
        public Task<int> SaveChangeAsync();
    }
}
