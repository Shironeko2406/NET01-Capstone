using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.RoleRepo
{
    public interface IRoleRepository
    {
        Task<Role?> GetByNameAsync(string roleName);
    }
}
