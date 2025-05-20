using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Services;

namespace ClinictManagementSystem.Repositories.Generic
{
    public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : BaseEntity
    {
        private readonly AppDbContext _context;
        private readonly DbSet<TEntity> _dbSet;
        private readonly ICurrentTime _timeService;
        public GenericRepository(AppDbContext context, ICurrentTime timeService)
        {
            _context = context;
            _timeService = timeService;
            _dbSet = _context.Set<TEntity>();
        }

        public async Task<TEntity> GetByIdAsync(Guid id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<List<TEntity>> GetAllAsync(Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null)
        {
            IQueryable<TEntity> query = _dbSet.Where(e => !e.IsDeleted);

            if (orderBy != null)
            {
                query = orderBy(query);
            }

            return await query.ToListAsync();
        }


        public async Task<IEnumerable<TEntity>> FindAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public async Task AddAsync(TEntity entity)
        {
            entity.CreationDate = _timeService.GetCurrentTime();
            await _dbSet.AddAsync(entity);
        }

        public async Task UpdateAsync(TEntity entity)
        {
            _dbSet.Update(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public void SoftDelete(TEntity entity)
        {
            entity.IsDeleted = true;
            _dbSet.Update(entity);
        }

        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }

        public virtual async Task<Pagination<TEntity>> GetFilterAsync(
            Expression<Func<TEntity, bool>>? filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
            string includeProperties = "",
            int? pageIndex = null,
            int? pageSize = null,
            string? foreignKey = null,
            object? foreignKeyId = null)
        {
            IQueryable<TEntity> query = _dbSet.Where(e => e.IsDeleted != true);
            if (!string.IsNullOrEmpty(foreignKey) && foreignKeyId != null)
            {
                if (foreignKeyId is Guid guidValue)
                {
                    query = query.Where(e => EF.Property<Guid>(e, foreignKey) == guidValue);
                }
                else if (foreignKeyId is string stringValue)
                {
                    query = query.Where(e => EF.Property<string>(e, foreignKey) == stringValue);
                }
                else
                {
                    throw new ArgumentException("Unsupported foreign key type");
                }
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            var itemCount = await query.CountAsync();
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else
            {
                query = query.OrderByDescending(e => e.CreationDate);
            }

            if (pageIndex.HasValue && pageSize.HasValue)
            {
                int validPageIndex = pageIndex.Value > 0 ? pageIndex.Value - 1 : 0;
                int validPageSize = pageSize.Value > 0 ? pageSize.Value : 10;

                query = query.Skip(validPageIndex * validPageSize).Take(validPageSize);
            }

            var result = new Pagination<TEntity>()
            {
                PageIndex = pageIndex ?? 0,
                PageSize = pageSize ?? 10,
                TotalItemsCount = itemCount,
                Items = await query.ToListAsync(),
            };

            return result;
        }

        public async Task AddRangeAsync(List<TEntity> entities)
        {
            foreach (var entity in entities)
            {
                entity.CreationDate = _timeService.GetCurrentTime();
            }
            await _dbSet.AddRangeAsync(entities);
        }
    }
}
