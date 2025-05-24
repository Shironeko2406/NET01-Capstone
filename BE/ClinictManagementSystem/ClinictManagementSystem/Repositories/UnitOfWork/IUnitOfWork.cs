using ClinictManagementSystem.Repositories.AppoinmentRepo;
using ClinictManagementSystem.Repositories.AppointmentServicesRepo;
using ClinictManagementSystem.Repositories.DoctorScheduleRepo;
using ClinictManagementSystem.Repositories.DoctorSpecialtyRepo;
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

namespace ClinictManagementSystem.Repositories.UnitOfWork
{
    public interface IUnitOfWork
    {
        public IUsersRepository UsersRepository { get; }
        public IServiceRepository ServiceRepository { get; }
        public ISpecialtyRepository SpecialtyRepository { get; }
        public IDoctorSpecialtyRepository DoctorSpecialtyRepository { get; }
        public IDoctorScheduleRepository DoctorScheduleRepository { get; }
        public IMedicineTypeRepository MedicineTypeRepository { get; }
        public IMedicineRepository MedicineRepository { get; }
        public IMedicineStockHistoryRepository MedicineStockHistoryRepository { get; }
        public IRoleRepository RoleRepository { get; }
        public IAppoinmentRepository AppoinmentRepository { get; }
        public IAppointmentServicesRepository AppointmentServicesRepository { get; }
        public ITestResultRepository TestResultRepository { get; }
        public IPrescriptionRepository PrescriptionRepository { get; }
        public IPrescriptionDetailsRepository PrescriptionDetailsRepository { get; }

        public Task<int> SaveChangeAsync();
    }
}
