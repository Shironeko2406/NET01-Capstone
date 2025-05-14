using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;
using Microsoft.EntityFrameworkCore;
using System;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly IServiceRepository _serviceRepository;
        private readonly ISpecialtyRepository _specialtyRepository;
        public UnitOfWork(AppDbContext context, IServiceRepository serviceRepository, ISpecialtyRepository specialtyRepository)
        {
            _dbContext = context;
            _serviceRepository = serviceRepository;
            _specialtyRepository = specialtyRepository;
        }

        public IServiceRepository ServiceRepository => _serviceRepository;
        public ISpecialtyRepository SpecialtyRepository => _specialtyRepository;
        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
