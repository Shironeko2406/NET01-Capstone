using ClinictManagementSystem.Models.Entity;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

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
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionDetails> PrescriptionDetails { get; set; }
        public DbSet<Medicines> Medicines { get; set; }
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
        }
    }
}
