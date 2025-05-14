using ClinictManagementSystem.Repositories.ServiceRepo;
using Microsoft.EntityFrameworkCore;
using System;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly IServiceRepository _serviceRepository;
        public UnitOfWork(AppDbContext context, IServiceRepository serviceRepository)
        {
            _dbContext = context;
            _serviceRepository = serviceRepository;
        }

        public IServiceRepository ServiceRepository => _serviceRepository;

        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
