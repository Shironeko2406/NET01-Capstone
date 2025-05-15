using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
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
        private readonly IMedicineTypeRepository _medicineTypeRepository;
        private readonly IMedicineRepocitory _medicineRepository;
        private readonly IMedicineStockHistoryRepository _medicineStockHistoryRepositoryy;

        public UnitOfWork(
            AppDbContext context,
            IServiceRepository serviceRepository,
            ISpecialtyRepository specialtyRepository,
            IMedicineTypeRepository medicineTypeRepository,
            IMedicineRepocitory medicineRepocitory,
            IMedicineStockHistoryRepository medicineStockHistoryRepository
        )
        {
            _dbContext = context;
            _serviceRepository = serviceRepository;
            _specialtyRepository = specialtyRepository;
            _medicineTypeRepository = medicineTypeRepository;
            _medicineRepository = medicineRepocitory;
            _medicineStockHistoryRepositoryy = medicineStockHistoryRepository;
        }

        public IServiceRepository ServiceRepository => _serviceRepository;
        public ISpecialtyRepository SpecialtyRepository => _specialtyRepository;
        public IMedicineTypeRepository MedicineTypeRepository => _medicineTypeRepository;
        public IMedicineRepocitory MedicineRepocitory => _medicineRepository;
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository => _medicineStockHistoryRepositoryy;

        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
