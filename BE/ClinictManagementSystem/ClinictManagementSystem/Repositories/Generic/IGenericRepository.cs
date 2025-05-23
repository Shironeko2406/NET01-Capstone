using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.Entity;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.Generic
{
    public interface IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        Task<TEntity?> GetByIdAsync(Guid id);
        Task<List<TEntity>> GetAllAsync(Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null);
        Task<Pagination<TEntity>> GetFilterAsync(
           Expression<Func<TEntity, bool>>? filter = null,
           Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
           string includeProperties = "",
           int? pageIndex = null,
           int? pageSize = null,
           string? foreignKey = null,
           object? foreignKeyId = null);
        Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddAsync(TEntity entity);
        Task UpdateAsync(TEntity entity);
        Task DeleteAsync(Guid id);
        void SoftDelete(TEntity entity);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate);
        Task AddRangeAsync(List<TEntity> entities);
    }
}
