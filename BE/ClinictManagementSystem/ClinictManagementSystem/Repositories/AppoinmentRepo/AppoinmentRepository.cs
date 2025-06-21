using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;
using ClinictManagementSystem.Repositories.MedicineRepo;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1;
using System.Linq.Expressions;
using System.Linq;

namespace ClinictManagementSystem.Repositories.AppoinmentRepo
{
    public class AppoinmentRepository : GenericRepository<Appointment>, IAppoinmentRepository
    {
        private readonly AppDbContext _dbContext;
        public AppoinmentRepository(
            AppDbContext context,
            ICurrentTime timeService,
            IClaimsService claimsService)
            : base(context, timeService, claimsService)
        {
            _dbContext = context;
        }

        public async Task<int> CountByStatusAsync(AppointmentStatusEnum status)
        {
            return await _dbContext.Appointments
                .Where(a => !a.IsDeleted && a.Status == status)
                .CountAsync();
        }

        public async Task<int> CountTodayAsync(DateTime today)
        {
            return await _dbContext.Appointments
                .Where(a => !a.IsDeleted && a.AppointmentDate.Date == today.Date)
                .CountAsync();
        }

        public async Task<Appointment?> GetAppointmentDetailByIdAsync(Guid appointmentId)
        {
            return await _dbContext.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .Include(a => a.Specialty)
                .Include(a => a.AppointmentServices
                    .Where(aps => !aps.IsDeleted))
                    .ThenInclude(aps => aps.Service)
                .Include(a => a.AppointmentServices)
                    .ThenInclude(aps => aps.TestResult)
                        .ThenInclude(tr => tr.UpdatedByUser)
                .Include(a => a.Prescription)
                    .ThenInclude(p => p.PrescriptionDetails)
                        .ThenInclude(pd => pd.Medicine)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId);
        }

        public async Task<Appointment?> GetAppointmentWithDetailsForInvoiceAsync(Guid appointmentId)
        {
            return await _dbContext.Appointments
                .Include(a => a.AppointmentServices)
                    .ThenInclude(aps => aps.Service)
                .Include(a => a.Prescription)
                    .ThenInclude(p => p.PrescriptionDetails)
                        .ThenInclude(pd => pd.Medicine)
                .FirstOrDefaultAsync(a => a.AppointmentId == appointmentId && !a.IsDeleted);
        }

        public async Task<Pagination<Appointment>> GetAppointmentsWithFilterAsync(
            Expression<Func<Appointment, bool>>? filter = null,
            Func<IQueryable<Appointment>, IOrderedQueryable<Appointment>>? orderBy = null,
            string includeProperties = "",
            int? pageIndex = null,
            int? pageSize = null,
            string? foreignKey = null,
            object? foreignKeyId = null,
            Expression<Func<AppointmentServices, bool>>? relatedDataFilter = null,
            string? relatedDataProperty = null)
        {
            IQueryable<Appointment> query = _dbContext.Appointments.Where(a => !a.IsDeleted);

            // Filter theo foreign key nếu có
            if (!string.IsNullOrEmpty(foreignKey) && foreignKeyId != null)
            {
                if (foreignKeyId is Guid guidValue)
                {
                    query = query.Where(e => EF.Property<Guid>(e, foreignKey) == guidValue);
                }
                else if (foreignKeyId is string stringValue)
                {
                    query = query.Where(e => EF.Property<string>(e, foreignKey) == stringValue);
                }
                else
                {
                    throw new ArgumentException("Unsupported foreign key type");
                }
            }

            // Áp dụng filter chính
            if (filter != null)
            {
                query = query.Where(filter);
            }

            // Tách include ra xử lý từng cái
            foreach (var includeProperty in includeProperties.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                if (relatedDataFilter != null && relatedDataProperty != null && includeProperty.Trim() == relatedDataProperty)
                {
                    // Chỉ xử lý cụ thể với AppointmentServices
                    query = query
                        .Include(a => a.AppointmentServices.Where(s => !s.IsDeleted)) // lọc mềm
                            .ThenInclude(s => s.Service)
                        .Include(a => a.AppointmentServices)
                            .ThenInclude(s => s.TestResult);
                }
                else
                {
                    query = query.Include(includeProperty.Trim());
                }
            }

            // Tổng số bản ghi
            var itemCount = await query.CountAsync();

            // Sắp xếp
            if (orderBy != null)
            {
                query = orderBy(query);
            }
            else
            {
                query = query.OrderByDescending(e => e.CreationDate);
            }

            // Phân trang
            if (pageIndex.HasValue && pageSize.HasValue)
            {
                int skip = (pageIndex.Value > 0 ? pageIndex.Value - 1 : 0) * (pageSize.Value > 0 ? pageSize.Value : 10);
                query = query.Skip(skip).Take(pageSize.Value);
            }

            var result = new Pagination<Appointment>
            {
                PageIndex = pageIndex ?? 0,
                PageSize = pageSize ?? 10,
                TotalItemsCount = itemCount,
                Items = await query.ToListAsync()
            };

            return result;
        }


    }
}
