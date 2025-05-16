using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.ServiceRepo;

namespace ClinictManagementSystem.Repositories.UsersRepo
{
    public class UsersRepository : GenericRepository<Users>, IUsersRepository
    {
        public UsersRepository(AppDbContext context, ICurrentTime timeService) : base(context, timeService)
        {
        }
    }
}
