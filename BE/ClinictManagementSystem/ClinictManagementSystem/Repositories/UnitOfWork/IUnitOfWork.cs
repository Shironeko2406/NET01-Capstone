using ClinictManagementSystem.Repositories.ServiceRepo;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IServiceRepository ServiceRepository { get; }
        public Task<int> SaveChangeAsync();
    }
}
