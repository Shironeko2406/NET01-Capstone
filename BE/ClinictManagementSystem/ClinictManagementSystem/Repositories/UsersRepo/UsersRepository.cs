using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.ServiceRepo;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Repositories.UsersRepo
{
    public class UsersRepository : GenericRepository<Users>, IUsersRepository
    {
        private readonly AppDbContext _dbContext;
        public UsersRepository(AppDbContext context, ICurrentTime timeService, IClaimsService claimsService) : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<bool> CheckUserNameExistAsync(string username)
        {
            return await _dbContext.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<Users?> GetByUsernameOrEmailAsync(string username, string email)
        {
            return await _dbContext.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == email);
        }

        public async Task<Pagination<Users>> GetFilterUserAsync(
            Expression<Func<Users, bool>>? filter = null,
            Func<IQueryable<Users>, IOrderedQueryable<Users>>? orderBy = null,
            string includeProperties = "",
            int? pageIndex = null,
            int? pageSize = null,
            string? role = null,
            string? foreignKey = null,
            object? foreignKeyId = null)
        {
            IQueryable<Users> query = _dbContext.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role);

            if (!string.IsNullOrWhiteSpace(includeProperties))
            {
                foreach (var includeProp in includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp.Trim());
                }
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (!string.IsNullOrEmpty(role))
            {
                query = query.Where(u => u.UserRoles.Any(ur => ur.Role.RoleName == role));
            }

            if (!string.IsNullOrEmpty(foreignKey) && foreignKeyId != null)
            {
                query = query.Where(u => EF.Property<object>(u, foreignKey).Equals(foreignKeyId));
            }

            var totalItems = await query.CountAsync();

            // 👉 Sắp xếp theo CreationDate giảm dần mặc định
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else
            {
                query = query.OrderByDescending(u => u.CreationDate);
            }

            if (pageIndex != null && pageSize != null)
            {
                query = query
                    .Skip(((int)pageIndex - 1) * (int)pageSize)
                    .Take((int)pageSize);
            }

            var items = await query.ToListAsync();

            return new Pagination<Users>
            {
                TotalItemsCount = totalItems,
                PageSize = pageSize ?? totalItems,
                PageIndex = pageIndex ?? 1,
                Items = items
            };
        }

        public async Task<Users> GetUserByUserName(string username)
        {
            var user = await _dbContext.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Include(u => u.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty) // Load luôn thông tin chuyên khoa
                .FirstOrDefaultAsync(u => u.Username == username);

            if (user is null)
                throw new Exception("Username or password is not correct!");

            return user;
        }

        public async Task<Users> GetUserById(Guid userId)
        {
            var user = await _dbContext.Users
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Include(u => u.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user is null)
                throw new Exception("User not found!");

            return user;
        }

        public async Task<Users?> GetUserWithSpecialtiesAsync(Guid userId)
        {
            return await _dbContext.Users
                .Include(u => u.DoctorSpecialties)
                    .ThenInclude(ds => ds.Specialty)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<List<Users>> GetAvailableDoctorsAsync(DateTime date, TimeSpan? startTime, TimeSpan? endTime, Guid? specialtyId)
        {
            var query = _dbContext.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.DoctorSchedules)
                .Include(u => u.DoctorSpecialties).ThenInclude(ds => ds.Specialty)
                .Include(u => u.AppointmentsAsDoctor)
                .Where(u => u.UserRoles.Any(ur => ur.Role.RoleName == AppRole.Doctor) &&
                            u.DoctorSchedules.Any(s => s.DayOfWeek == date.DayOfWeek) &&
                            u.DoctorSpecialties.Any(ds => ds.SpecialtyId == specialtyId));

            if (startTime.HasValue)
            {
                query = query.Where(u => u.DoctorSchedules.Any(s => s.StartTime <= startTime.Value));
            }

            if (endTime.HasValue)
            {
                query = query.Where(u => u.DoctorSchedules.Any(s => s.EndTime >= endTime.Value));
            }

            // Loại trừ bác sĩ có lịch hẹn xung đột
            //query = query.Where(u => !u.AppointmentsAsDoctor.Any(a =>
            //    a.AppointmentDate.Date == date.Date &&
            //    (
            //        (!startTime.HasValue && !endTime.HasValue) ? false :
            //        (!startTime.HasValue && a.StartTime < endTime) ||
            //        (!endTime.HasValue && a.EndTime > startTime) ||
            //        (startTime.HasValue && endTime.HasValue &&
            //            a.StartTime < endTime &&
            //            a.EndTime > startTime)
            //    )
            //));
            query = query.Where(u => !u.AppointmentsAsDoctor.Any(a =>
                a.AppointmentDate.Date == date.Date &&
                (a.Status == AppointmentStatusEnum.Booked ||
                 a.Status == AppointmentStatusEnum.Waiting ||
                 a.Status == AppointmentStatusEnum.InProgress) &&

                (
                    (!startTime.HasValue && !endTime.HasValue) ? false :
                    (!startTime.HasValue && a.StartTime < endTime) ||
                    (!endTime.HasValue && a.EndTime > startTime) ||
                    (startTime.HasValue && endTime.HasValue &&
                        a.StartTime < endTime &&
                        a.EndTime > startTime)
                )
            ));

            return await query.ToListAsync();
        }

        public async Task<bool> CheckDoctorAvailableAsync(Guid doctorId, DateTime date, TimeSpan startTime, TimeSpan endTime)
        {
            return !await _dbContext.Appointments
                .AnyAsync(a =>
                    a.DoctorId == doctorId &&
                    a.AppointmentDate.Date == date.Date &&
                    (a.Status == AppointmentStatusEnum.Booked ||
                     a.Status == AppointmentStatusEnum.Waiting ||
                     a.Status == AppointmentStatusEnum.InProgress) &&
                    a.StartTime < endTime &&
                    a.EndTime > startTime
                );
        }

        public async Task<bool> CheckDoctorInSpecialtyAsync(Guid doctorId, Guid specialtyId)
        {
            return await _dbContext.DoctorSpecialties
                .AnyAsync(ds => ds.DoctorId == doctorId && ds.SpecialtyId == specialtyId);
        }
    }
}
