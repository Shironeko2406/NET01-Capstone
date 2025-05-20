using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.UsersRepo
{
    public interface IUsersRepository : IGenericRepository<Users>
    {
        Task<Pagination<Users>> GetFilterUserAsync(
           Expression<Func<Users, bool>>? filter = null,
           Func<IQueryable<Users>, IOrderedQueryable<Users>>? orderBy = null,
           string includeProperties = "",
           int? pageIndex = null,
           int? pageSize = null,
           string? role = null,
           string? foreignKey = null,
           object? foreignKeyId = null);
        Task<Users> GetUserByUserName(string username);
        Task<Users> GetUserById(Guid userId);
        Task<Users?> GetUserWithSpecialtiesAsync(Guid userId);
        Task<Users?> GetByUsernameOrEmailAsync(string username, string email);
        Task<bool> CheckUserNameExistAsync(string username);
        Task<List<Users>> GetAvailableDoctorsAsync(DateTime date, TimeSpan? startTime, TimeSpan? endTime, Guid? specialtyId);
    }
}
