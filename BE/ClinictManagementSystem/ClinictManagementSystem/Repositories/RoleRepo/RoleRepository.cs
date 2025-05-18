using ClinictManagementSystem.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Repositories.RoleRepo
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;
        public RoleRepository(AppDbContext context)
        { 
            _context = context;
        }

        public async Task<Role?> GetByNameAsync(string roleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.ToLower());
        }
    }
}
