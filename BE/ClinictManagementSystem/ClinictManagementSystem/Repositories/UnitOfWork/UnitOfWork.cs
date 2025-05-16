using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;
using ClinictManagementSystem.Repositories.UsersRepo;
using Microsoft.EntityFrameworkCore;
using System;

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly IUsersRepository _usersRepository;
        private readonly IServiceRepository _serviceRepository;
        private readonly ISpecialtyRepository _specialtyRepository;
        private readonly IMedicineTypeRepository _medicineTypeRepository;
        private readonly IMedicineRepository _medicineRepository;
        private readonly IMedicineStockHistoryRepository _medicineStockHistoryRepositoryy;

        public UnitOfWork(
            AppDbContext context,
            IUsersRepository usersRepository,
            IServiceRepository serviceRepository,
            ISpecialtyRepository specialtyRepository,
            IMedicineTypeRepository medicineTypeRepository,
            IMedicineRepository medicineRepocitory,
            IMedicineStockHistoryRepository medicineStockHistoryRepository
        )
        {
            _dbContext = context;
            _usersRepository = usersRepository;
            _serviceRepository = serviceRepository;
            _specialtyRepository = specialtyRepository;
            _medicineTypeRepository = medicineTypeRepository;
            _medicineRepository = medicineRepocitory;
            _medicineStockHistoryRepositoryy = medicineStockHistoryRepository;
        }
        public IUsersRepository UsersRepository => _usersRepository;
        public IServiceRepository ServiceRepository => _serviceRepository;
        public ISpecialtyRepository SpecialtyRepository => _specialtyRepository;
        public IMedicineTypeRepository MedicineTypeRepository => _medicineTypeRepository;
        public IMedicineRepository MedicineRepository => _medicineRepository;
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository => _medicineStockHistoryRepositoryy;
        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
