using ClinictManagementSystem.Repositories.DoctorSpecialtyRepo;
using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.RoleRepo;
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
        private readonly IDoctorSpecialtyRepository _doctorSpecialtyRepository;
        private readonly IMedicineTypeRepository _medicineTypeRepository;
        private readonly IMedicineRepository _medicineRepository;
        private readonly IMedicineStockHistoryRepository _medicineStockHistoryRepositoryy;
        private readonly IRoleRepository _roleRepository;

        public UnitOfWork(
            AppDbContext context,
            IUsersRepository usersRepository,
            IServiceRepository serviceRepository,
            ISpecialtyRepository specialtyRepository,
            IDoctorSpecialtyRepository doctorSpecialtyRepository,
            IMedicineTypeRepository medicineTypeRepository,
            IMedicineRepository medicineRepocitory,
            IMedicineStockHistoryRepository medicineStockHistoryRepository,
            IRoleRepository roleRepository
        )
        {
            _dbContext = context;
            _usersRepository = usersRepository;
            _serviceRepository = serviceRepository;
            _specialtyRepository = specialtyRepository;
            _doctorSpecialtyRepository = doctorSpecialtyRepository;
            _medicineTypeRepository = medicineTypeRepository;
            _medicineRepository = medicineRepocitory;
            _medicineStockHistoryRepositoryy = medicineStockHistoryRepository;
            _roleRepository = roleRepository;
            _roleRepository = roleRepository;
        }
        public IUsersRepository UsersRepository => _usersRepository;
        public IServiceRepository ServiceRepository => _serviceRepository;
        public ISpecialtyRepository SpecialtyRepository => _specialtyRepository;
        public IDoctorSpecialtyRepository DoctorSpecialtyRepository => _doctorSpecialtyRepository;
        public IMedicineTypeRepository MedicineTypeRepository => _medicineTypeRepository;
        public IMedicineRepository MedicineRepository => _medicineRepository;
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository => _medicineStockHistoryRepositoryy;
        public IRoleRepository RoleRepository => _roleRepository;

        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
