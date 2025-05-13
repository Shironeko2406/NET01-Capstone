using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.Generic
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<TEntity?> GetByIdAsync(Guid id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(Guid id);
        void SoftDelete(TEntity entity);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
    }
}
