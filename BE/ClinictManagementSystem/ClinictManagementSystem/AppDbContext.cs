using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Helper;
using ClinictManagementSystem.Models.Entity;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Specialties> Specialties { get; set; }
        public DbSet<DoctorSpecialties> DoctorSpecialties { get; set; }
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionDetails> PrescriptionDetails { get; set; }
        public DbSet<Medicines> Medicines { get; set; }
        public DbSet<MedicineStockHistory> MedicineStockHistorys { get; set; }
        public DbSet<MedicineType> MedicineTypes { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<TestResult> TestResults { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<AppointmentServices> AppointmentServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình mối quan hệ giữa Appointment và Users (Patient và Doctor)
            modelBuilder.Entity<Appointment>()
               .HasOne(a => a.Patient)
               .WithMany(u => u.AppointmentsAsPatient)
               .HasForeignKey(a => a.PatientId)
               .OnDelete(DeleteBehavior.Restrict); // Tránh xóa dây chuyền gây lỗi

            // Relationship: Appointment -> Doctor
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(u => u.AppointmentsAsDoctor)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Khóa chính tổng hợp cho UserRole
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            // Cấu hình quan hệ với Users
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            // Cấu hình quan hệ với Role
            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            // Cấu hình Doctor <-> DoctorSpecialties
            modelBuilder.Entity<DoctorSpecialties>()
                .HasOne(ds => ds.Doctor)
                .WithMany(u => u.DoctorSpecialties)
                .HasForeignKey(ds => ds.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình Specialty <-> DoctorSpecialties
            modelBuilder.Entity<DoctorSpecialties>()
                .HasOne(ds => ds.Specialty)
                .WithMany(s => s.DoctorSpecialties)
                .HasForeignKey(ds => ds.SpecialtyId)
                .OnDelete(DeleteBehavior.Restrict);

            //--------------------- Dữ liệu thiết lập ----------------------------

            // Hardcoded Role GUIDs
            var rolePatientId = new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var roleDoctorId = new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
            var roleReceptionistId = new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc");
            var roleAdminId = new Guid("dddddddd-dddd-dddd-dddd-dddddddddddd");

            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = rolePatientId, RoleName = AppRole.Patient },
                new Role { RoleId = roleDoctorId, RoleName = AppRole.Doctor },
                new Role { RoleId = roleReceptionistId, RoleName = AppRole.Receptionist },
                new Role { RoleId = roleAdminId, RoleName = AppRole.Admin }
            );

            // ====== Seed Users ======
            // Hardcoded User GUIDs
            var userPatientId = new Guid("11111111-1111-1111-1111-111111111111");
            var userDoctorId = new Guid("22222222-2222-2222-2222-222222222222");
            var userReceptionistId = new Guid("33333333-3333-3333-3333-333333333333");
            var userAdminId = new Guid("44444444-4444-4444-4444-444444444444");

            // Hardcoded PasswordHashes
            var passHash = "$2a$11$85pu8Gq/dNw/gKhT3bl/t.vLWCIL2ABA7tiQ8M7EGUx68JOJUbP.i";

            modelBuilder.Entity<Users>().HasData(
                new Users
                {
                    UserId = userPatientId,
                    FullName = "Nguyễn Văn A",
                    Username = "patient",
                    PasswordHash = passHash,
                    Email = "patient@example.com",
                    DateOfBirth = new DateTime(1990, 1, 1),
                    Gender = GenderEnum.Male,
                    PhoneNumber = "0123456789",
                    Address = "Hà Nội",
                    CreationDate = new DateTime(2023, 1, 1),
                    Status = UserStatusEnum.Active
                },
                new Users
                {
                    UserId = userDoctorId,
                    FullName = "Trần Văn B",
                    Username = "doctor",
                    PasswordHash = passHash,
                    Email = "doctor@example.com",
                    DateOfBirth = new DateTime(1985, 5, 10),
                    Gender = GenderEnum.Male,
                    PhoneNumber = "0987654321",
                    Address = "HCM",
                    CreationDate = new DateTime(2023, 1, 1),
                    Status = UserStatusEnum.Active
                },
                new Users
                {
                    UserId = userReceptionistId,
                    FullName = "Lê Thị C",
                    Username = "receptionist",
                    PasswordHash = passHash,
                    Email = "receptionist@example.com",
                    DateOfBirth = new DateTime(1995, 3, 15),
                    Gender = GenderEnum.Female,
                    PhoneNumber = "0911222333",
                    Address = "Đà Nẵng",
                    CreationDate = new DateTime(2023, 1, 1),
                    Status = UserStatusEnum.Active
                },
                new Users
                {
                    UserId = userAdminId,
                    FullName = "Admin System",
                    Username = "admin",
                    PasswordHash = passHash,
                    Email = "admin@example.com",
                    DateOfBirth = new DateTime(1980, 1, 1),
                    Gender = GenderEnum.Male,
                    PhoneNumber = "0999888777",
                    Address = "System HQ",
                    CreationDate = new DateTime(2023, 1, 1),
                    Status = UserStatusEnum.Active
                }
            );

            // ====== Seed UserRoles ======
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { UserId = userPatientId, RoleId = rolePatientId },
                new UserRole { UserId = userDoctorId, RoleId = roleDoctorId },
                new UserRole { UserId = userReceptionistId, RoleId = roleReceptionistId },
                new UserRole { UserId = userAdminId, RoleId = roleAdminId }
            );


        }
    }
}
