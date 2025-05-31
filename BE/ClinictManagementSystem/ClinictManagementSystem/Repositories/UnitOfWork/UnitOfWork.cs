using ClinictManagementSystem.Repositories.AppoinmentRepo;
using ClinictManagementSystem.Repositories.AppointmentServicesRepo;
using ClinictManagementSystem.Repositories.DoctorScheduleRepo;
using ClinictManagementSystem.Repositories.DoctorSpecialtyRepo;
using ClinictManagementSystem.Repositories.InvoiceRepo;
using ClinictManagementSystem.Repositories.MedicineRepo;
using ClinictManagementSystem.Repositories.MedicineStockHistoryRepo;
using ClinictManagementSystem.Repositories.MedicineTypeRepo;
using ClinictManagementSystem.Repositories.PrescriptionDetailsRepo;
using ClinictManagementSystem.Repositories.PrescriptionRepo;
using ClinictManagementSystem.Repositories.RoleRepo;
using ClinictManagementSystem.Repositories.ServiceRepo;
using ClinictManagementSystem.Repositories.SpecialtyRepo;
using ClinictManagementSystem.Repositories.TestResultRepo;
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
        private readonly IDoctorScheduleRepository _doctorScheduleRepository;
        private readonly IMedicineTypeRepository _medicineTypeRepository;
        private readonly IMedicineRepository _medicineRepository;
        private readonly IMedicineStockHistoryRepository _medicineStockHistoryRepositoryy;
        private readonly IRoleRepository _roleRepository;
        private readonly IAppoinmentRepository _appoinmentRepository;
        private readonly IAppointmentServicesRepository _appointmentServicesRepository;
        private readonly ITestResultRepository _testResultRepository;
        private readonly IPrescriptionRepository _prescriptionRepository;
        private readonly IPrescriptionDetailsRepository _prescriptionDetailsRepository;
        private readonly IInvoiceRepository _invoiceRepository;


        public UnitOfWork(
            AppDbContext context,
            IUsersRepository usersRepository,
            IServiceRepository serviceRepository,
            ISpecialtyRepository specialtyRepository,
            IDoctorSpecialtyRepository doctorSpecialtyRepository,
            IDoctorScheduleRepository doctorScheduleRepository,
            IMedicineTypeRepository medicineTypeRepository,
            IMedicineRepository medicineRepocitory,
            IMedicineStockHistoryRepository medicineStockHistoryRepository,
            IRoleRepository roleRepository,
            IAppoinmentRepository appoinmentRepository,
            IAppointmentServicesRepository appointmentServicesRepository,
            ITestResultRepository testResultRepository,
            IPrescriptionRepository prescriptionRepository,
            IPrescriptionDetailsRepository prescriptionDetailsRepository,
            IInvoiceRepository invoiceRepository
        )
        {
            _dbContext = context;
            _usersRepository = usersRepository;
            _serviceRepository = serviceRepository;
            _specialtyRepository = specialtyRepository;
            _doctorSpecialtyRepository = doctorSpecialtyRepository;
            _doctorScheduleRepository = doctorScheduleRepository;
            _medicineTypeRepository = medicineTypeRepository;
            _medicineRepository = medicineRepocitory;
            _medicineStockHistoryRepositoryy = medicineStockHistoryRepository;
            _roleRepository = roleRepository;
            _roleRepository = roleRepository;
            _appoinmentRepository = appoinmentRepository;
            _appointmentServicesRepository = appointmentServicesRepository;
            _testResultRepository = testResultRepository;
            _prescriptionRepository = prescriptionRepository;
            _prescriptionDetailsRepository = prescriptionDetailsRepository;
            _invoiceRepository = invoiceRepository;
        }
        public IUsersRepository UsersRepository => _usersRepository;
        public IServiceRepository ServiceRepository => _serviceRepository;
        public ISpecialtyRepository SpecialtyRepository => _specialtyRepository;
        public IDoctorSpecialtyRepository DoctorSpecialtyRepository => _doctorSpecialtyRepository;
        public IDoctorScheduleRepository DoctorScheduleRepository => _doctorScheduleRepository;
        public IMedicineTypeRepository MedicineTypeRepository => _medicineTypeRepository;
        public IMedicineRepository MedicineRepository => _medicineRepository;
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository => _medicineStockHistoryRepositoryy;
        public IRoleRepository RoleRepository => _roleRepository;
        public IAppoinmentRepository AppoinmentRepository => _appoinmentRepository;
        public IAppointmentServicesRepository AppointmentServicesRepository => _appointmentServicesRepository;
        public ITestResultRepository TestResultRepository => _testResultRepository;
        public IPrescriptionRepository PrescriptionRepository => _prescriptionRepository;
        public IPrescriptionDetailsRepository PrescriptionDetailsRepository => _prescriptionDetailsRepository;
        public IInvoiceRepository InvoiceRepository => _invoiceRepository;

        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
