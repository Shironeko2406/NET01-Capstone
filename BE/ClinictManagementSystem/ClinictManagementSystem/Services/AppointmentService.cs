using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Helper;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.EmailDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IClaimsService _claimService;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        public AppointmentService(
            IUnitOfWork unitOfWork,
            ICurrentTime currentTime,
            IClaimsService claimService,
            IUserService userService,
            IEmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _claimService = claimService;
            _userService = userService;
            _emailService = emailService;
        }

        public async Task<ApiResponse<bool>> CreateAppoinment(CreateAppoinmentDTO createAppoinmentDTO)
        {
            try
            {
                if (!await _unitOfWork.UsersRepository.CheckDoctorInSpecialtyAsync(createAppoinmentDTO.DoctorId, createAppoinmentDTO.SpecialtyId))
                {
                    return ResponseHandler.Failure<bool>("Bác sĩ không thuộc chuyên khoa đã chọn.");
                }

                if (!await _unitOfWork.UsersRepository.CheckDoctorAvailableAsync(createAppoinmentDTO.DoctorId, createAppoinmentDTO.AppointmentDate, createAppoinmentDTO.StartTime, createAppoinmentDTO.EndTime))
                {
                    return ResponseHandler.Failure<bool>("Bác sĩ không còn khả dụng trong khung giờ đã chọn.");
                }

                var patientId = _claimService.GetCurrentUserId();


                var appointment = new Appointment
                {
                    PatientId = patientId,
                    DoctorId = createAppoinmentDTO.DoctorId,
                    SpecialtyId = createAppoinmentDTO.SpecialtyId,
                    AppointmentDate = createAppoinmentDTO.AppointmentDate.Date,
                    AppointmentCode = await GenerateRandomAppointmentCodeAsync(),
                    StartTime = createAppoinmentDTO.StartTime,
                    EndTime = createAppoinmentDTO.EndTime,
                    Note = createAppoinmentDTO.Note,
                    Status = AppointmentStatusEnum.Booked
                };

                await _unitOfWork.AppoinmentRepository.AddAsync(appointment);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Tạo lịch hẹn thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }
        public async Task<ApiResponse<bool>> UpdateAppointmentStatusAsync(Guid appointmentId, AppointmentStatusEnum appointmentStatusEnum)
        {
            try
            {
                var appointment = await _unitOfWork.AppoinmentRepository.GetByIdAsync(appointmentId);

                if (appointment == null)
                    return ResponseHandler.Failure<bool>("Không tìm thấy lịch hẹn.");

                var currentStatus = appointment.Status;
                var appointmentDateTime = appointment.AppointmentDate.Date + appointment.StartTime;
                var now = _currentTime.GetCurrentTime();

                switch (appointmentStatusEnum)
                {
                    case AppointmentStatusEnum.Cancelled:
                        if (currentStatus != AppointmentStatusEnum.Booked)
                            return ResponseHandler.Failure<bool>("Chỉ có thể huỷ lịch ở trạng thái Booked.");

                        if ((appointmentDateTime - now).TotalHours < 24)
                            return ResponseHandler.Failure<bool>("Bạn chỉ có thể huỷ lịch trước ít nhất 24 giờ.");
                        break;

                    case AppointmentStatusEnum.Waiting:
                        if (currentStatus != AppointmentStatusEnum.Booked)
                            return ResponseHandler.Failure<bool>("Chỉ có thể chuyển sang Waiting từ trạng thái Booked.");

                        if (now < appointmentDateTime)
                            return ResponseHandler.Failure<bool>("Chỉ có thể chuyển sang trạng thái Waiting khi đến thời gian khám.");
                        break;

                    case AppointmentStatusEnum.InProgress:
                        if (currentStatus != AppointmentStatusEnum.Waiting)
                            return ResponseHandler.Failure<bool>("Chỉ có thể chuyển sang InProgress từ trạng thái Waiting.");
                        break;

                    case AppointmentStatusEnum.Completed:
                        if (currentStatus != AppointmentStatusEnum.InProgress)
                            return ResponseHandler.Failure<bool>("Chỉ có thể hoàn tất lịch hẹn từ trạng thái InProgress.");
                        break;

                    default:
                        return ResponseHandler.Failure<bool>("Trạng thái chuyển đổi không hợp lệ.");
                }

                appointment.Status = appointmentStatusEnum;
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Cập nhật trạng thái thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Lỗi: {ex.Message}");
            }
        }

        public async Task<string> GenerateRandomAppointmentCodeAsync()
        {
            string appointmentCode;
            do
            {
                var randomPart = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(); // 8 ký tự
                appointmentCode = $"APT-{randomPart}";
            }
            while (await _unitOfWork.AppoinmentRepository.AnyAsync(a => a.AppointmentCode == appointmentCode));

            return appointmentCode;
        }

        public async Task<ApiResponse<Pagination<GetAppointmentDTO>>> GetAppoinmentFilterByUserLoginAsync(FilterAppoinmentByPatientLoginDTO filterAppoinmentByPatientLoginDTO)
        {
            try
            {
                var userId = _claimService.GetCurrentUserId();

                // Build filter expression
                Expression<Func<Appointment, bool>> filter = x =>
                    x.PatientId == userId &&
                    (
                        string.IsNullOrEmpty(filterAppoinmentByPatientLoginDTO.Search) ||
                        x.AppointmentCode.Contains(filterAppoinmentByPatientLoginDTO.Search) ||
                        x.Doctor.FullName.Contains(filterAppoinmentByPatientLoginDTO.Search) ||
                        x.Specialty.Name.Contains(filterAppoinmentByPatientLoginDTO.Search)
                    ) &&
                    (!filterAppoinmentByPatientLoginDTO.StartDate.HasValue || x.AppointmentDate >= filterAppoinmentByPatientLoginDTO.StartDate.Value) &&
                    (!filterAppoinmentByPatientLoginDTO.EndDate.HasValue || x.AppointmentDate <= filterAppoinmentByPatientLoginDTO.EndDate.Value) &&
                    (!filterAppoinmentByPatientLoginDTO.AppointmentStatusEnum.HasValue || x.Status == filterAppoinmentByPatientLoginDTO.AppointmentStatusEnum.Value) &&
                    (!filterAppoinmentByPatientLoginDTO.specialtyId.HasValue || x.SpecialtyId == filterAppoinmentByPatientLoginDTO.specialtyId.Value);


                // Sort logic
                Func<IQueryable<Appointment>, IOrderedQueryable<Appointment>>? orderBy = null;
                if (filterAppoinmentByPatientLoginDTO.SortBy.HasValue)
                {
                    switch (filterAppoinmentByPatientLoginDTO.SortBy.Value)
                    {
                        case SortEnum.Ascending:
                            orderBy = q => q.OrderBy(a => a.AppointmentDate);
                            break;
                        case SortEnum.Descending:
                            orderBy = q => q.OrderByDescending(a => a.AppointmentDate);
                            break;
                    }
                }

                string include = "Doctor,Patient,Specialty";

                var result = await _unitOfWork.AppoinmentRepository.GetFilterAsync(
                    filter: filter,
                    orderBy: orderBy,
                    includeProperties: include,
                    pageIndex: filterAppoinmentByPatientLoginDTO.PageIndex,
                    pageSize: filterAppoinmentByPatientLoginDTO.PageSize
                );

                var mappedItems = result.Items.Select(x => new GetAppointmentDTO
                {
                    AppointmentId = x.AppointmentId,
                    AppointmentCode = x.AppointmentCode,
                    AppointmentDate = x.AppointmentDate,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    Status = x.Status,
                    DoctorId = x.DoctorId,
                    DoctorName = x.Doctor.FullName,
                    DoctorAvatar = x.Doctor.Avatar,

                    SpecialtyName = x.Specialty.Name,
                }).ToList();

                var response = new Pagination<GetAppointmentDTO>
                {
                    PageIndex = result.PageIndex,
                    PageSize = result.PageSize,
                    TotalItemsCount = result.TotalItemsCount,
                    Items = mappedItems
                };

                if (mappedItems == null || !mappedItems.Any())
                    return ResponseHandler.Success(response, "Không tìm thấy người dùng phù hợp!");

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetAppointmentDTO>>("Lỗi khi lọc lịch hẹn: " + ex.Message);
            }
        }

        public async Task<ApiResponse<Pagination<AppointmentManagementDTO>>> GetAppointmentsForAdminAsync(FilterAppointmentAdminDTO filterAppointmentAdminDTO)
        {
            try
            {
                // Build filter expression
                Expression<Func<Appointment, bool>> filter = x =>
                    (string.IsNullOrEmpty(filterAppointmentAdminDTO.Search) ||
                        x.AppointmentCode.Contains(filterAppointmentAdminDTO.Search) ||
                        x.Doctor.FullName.Contains(filterAppointmentAdminDTO.Search) ||
                        x.Patient.FullName.Contains(filterAppointmentAdminDTO.Search) ||
                        x.Specialty.Name.Contains(filterAppointmentAdminDTO.Search)) &&

                    (!filterAppointmentAdminDTO.StartDate.HasValue || x.AppointmentDate >= filterAppointmentAdminDTO.StartDate.Value) &&
                    (!filterAppointmentAdminDTO.EndDate.HasValue || x.AppointmentDate <= filterAppointmentAdminDTO.EndDate.Value) &&
                    (!filterAppointmentAdminDTO.Status.HasValue || x.Status == filterAppointmentAdminDTO.Status.Value) &&
                    (!filterAppointmentAdminDTO.DoctorId.HasValue || x.DoctorId == filterAppointmentAdminDTO.DoctorId.Value) &&
                    (!filterAppointmentAdminDTO.PatientId.HasValue || x.PatientId == filterAppointmentAdminDTO.PatientId.Value) &&
                    (!filterAppointmentAdminDTO.SpecialtyId.HasValue || x.SpecialtyId == filterAppointmentAdminDTO.SpecialtyId.Value);

                // Sort logic
                Func<IQueryable<Appointment>, IOrderedQueryable<Appointment>>? orderBy = null;
                if (filterAppointmentAdminDTO.SortBy.HasValue)
                {
                    switch (filterAppointmentAdminDTO.SortBy.Value)
                    {
                        case SortEnum.Ascending:
                            orderBy = q => q.OrderBy(a => a.AppointmentDate);
                            break;
                        case SortEnum.Descending:
                            orderBy = q => q.OrderByDescending(a => a.AppointmentDate);
                            break;
                    }
                }

                string include = "Doctor,Patient,Specialty";

                var result = await _unitOfWork.AppoinmentRepository.GetFilterAsync(
                    filter: filter,
                    orderBy: orderBy,
                    includeProperties: include,
                    pageIndex: filterAppointmentAdminDTO.PageIndex,
                    pageSize: filterAppointmentAdminDTO.PageSize
                );

                var mappedItems = result.Items.Select(x => new AppointmentManagementDTO
                {
                    AppointmentId = x.AppointmentId,
                    AppointmentCode = x.AppointmentCode,
                    AppointmentDate = x.AppointmentDate,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    Status = x.Status,

                    PatientName = x.Patient.FullName,

                    DoctorId = x.DoctorId,
                    DoctorName = x.Doctor.FullName,
                    DoctorAvatar = x.Doctor.Avatar,

                    SpecialtyName = x.Specialty.Name
                }).ToList();

                var response = new Pagination<AppointmentManagementDTO>
                {
                    PageIndex = result.PageIndex,
                    PageSize = result.PageSize,
                    TotalItemsCount = result.TotalItemsCount,
                    Items = mappedItems
                };

                if (mappedItems == null || !mappedItems.Any())
                    return ResponseHandler.Success(response, "Không tìm thấy lịch hẹn phù hợp!");

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<AppointmentManagementDTO>>("Lỗi khi lọc lịch hẹn (Admin): " + ex.Message);
            }
        }

        public async Task<ApiResponse<Pagination<GetAppointmentByDoctorDTO>>> GetAppoinmentFilterByDoctorLoginAsync(FilterAppoinmentByDoctorLoginDTO filterAppoinmentByDoctorLoginDTO)
        {
            try
            {
                var doctorId = _claimService.GetCurrentUserId();

                // Bộ lọc
                Expression<Func<Appointment, bool>> filter = x =>
                    x.DoctorId == doctorId &&
                    (
                        string.IsNullOrEmpty(filterAppoinmentByDoctorLoginDTO.Search) ||
                        x.AppointmentCode.Contains(filterAppoinmentByDoctorLoginDTO.Search) ||
                        x.Patient.FullName.Contains(filterAppoinmentByDoctorLoginDTO.Search) ||
                        x.Specialty.Name.Contains(filterAppoinmentByDoctorLoginDTO.Search)
                    ) &&
                    (!filterAppoinmentByDoctorLoginDTO.StartDate.HasValue || x.AppointmentDate >= filterAppoinmentByDoctorLoginDTO.StartDate.Value) &&
                    (!filterAppoinmentByDoctorLoginDTO.EndDate.HasValue || x.AppointmentDate <= filterAppoinmentByDoctorLoginDTO.EndDate.Value) &&
                    (!filterAppoinmentByDoctorLoginDTO.AppointmentStatusEnum.HasValue || x.Status == filterAppoinmentByDoctorLoginDTO.AppointmentStatusEnum.Value) &&
                    (!filterAppoinmentByDoctorLoginDTO.specialtyId.HasValue || x.SpecialtyId == filterAppoinmentByDoctorLoginDTO.specialtyId.Value);

                // Sắp xếp
                Func<IQueryable<Appointment>, IOrderedQueryable<Appointment>>? orderBy = null;
                if (filterAppoinmentByDoctorLoginDTO.SortBy.HasValue)
                {
                    switch (filterAppoinmentByDoctorLoginDTO.SortBy.Value)
                    {
                        case SortEnum.Ascending:
                            orderBy = q => q.OrderBy(a => a.AppointmentDate);
                            break;
                        case SortEnum.Descending:
                            orderBy = q => q.OrderByDescending(a => a.AppointmentDate);
                            break;
                    }
                }

                // Include liên quan
                string include = "Doctor,Patient,Specialty";

                var result = await _unitOfWork.AppoinmentRepository.GetFilterAsync(
                    filter: filter,
                    orderBy: orderBy,
                    includeProperties: include,
                    pageIndex: filterAppoinmentByDoctorLoginDTO.PageIndex,
                    pageSize: filterAppoinmentByDoctorLoginDTO.PageSize
                );

                var mappedItems = result.Items.Select(x => new GetAppointmentByDoctorDTO
                {
                    AppointmentId = x.AppointmentId,
                    AppointmentCode = x.AppointmentCode,
                    AppointmentDate = x.AppointmentDate,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    Status = x.Status,
                    PatientId = x.PatientId,
                    PatientName = x.Patient.FullName,
                    PatientAvatar = x.Patient.Avatar,
                    SpecialtyName = x.Specialty.Name
                }).ToList();

                var response = new Pagination<GetAppointmentByDoctorDTO>
                {
                    PageIndex = result.PageIndex,
                    PageSize = result.PageSize,
                    TotalItemsCount = result.TotalItemsCount,
                    Items = mappedItems
                };

                if (mappedItems == null || !mappedItems.Any())
                    return ResponseHandler.Success(response, "Không tìm thấy lịch hẹn phù hợp!");

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetAppointmentByDoctorDTO>>("Lỗi khi lọc lịch hẹn theo bác sĩ: " + ex.Message);
            }
        }

        public async Task<ApiResponse<bool>> UpdateAppointmentConclusionAsync(Guid appointmentId, UpdateConclusionDTO updateConclusionDTO)
        {
            try
            {
                var appointment = await _unitOfWork.AppoinmentRepository.GetByIdAsync(appointmentId);

                if (appointment == null)
                    return ResponseHandler.Failure<bool>("Appointment not found.");

                appointment.GeneralConclusion = updateConclusionDTO.GeneralConclusion;

                await _unitOfWork.SaveChangeAsync();
                return ResponseHandler.Success(true, "General conclusion updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> CreateAppointmentByReceptionist(CreateAppointmentByReceptionistDTO createAppointmentByReceptionistDTO)
        {
            try
            {
                // 1. Kiểm tra bác sĩ có thuộc chuyên khoa không
                var isDoctorInSpecialty = await _unitOfWork.UsersRepository.CheckDoctorInSpecialtyAsync(createAppointmentByReceptionistDTO.DoctorId, createAppointmentByReceptionistDTO.SpecialtyId);
                if (!isDoctorInSpecialty)
                {
                    return ResponseHandler.Failure<bool>("Bác sĩ không thuộc chuyên khoa đã chọn.");
                }

                // 2. Kiểm tra bác sĩ có rảnh trong khung giờ đã chọn không
                var isDoctorAvailable = await _unitOfWork.UsersRepository.CheckDoctorAvailableAsync(createAppointmentByReceptionistDTO.DoctorId, createAppointmentByReceptionistDTO.AppointmentDate, createAppointmentByReceptionistDTO.StartTime, createAppointmentByReceptionistDTO.EndTime);
                if (!isDoctorAvailable)
                {
                    return ResponseHandler.Failure<bool>("Bác sĩ không khả dụng trong khung giờ đã chọn.");
                }

                // 3. Tạo tài khoản người dùng mới (bệnh nhân)
                var credentials = await _userService.GenerateUserCredentials(createAppointmentByReceptionistDTO.FullName);

                var patientRole = await _unitOfWork.RoleRepository.GetByNameAsync("Patient");
                if (patientRole == null)
                {
                    return ResponseHandler.Failure<bool>("Không tìm thấy quyền 'Patient'.");
                }

                var newUser = new Users
                {
                    FullName = createAppointmentByReceptionistDTO.FullName,
                    Username = credentials.Username,
                    PasswordHash = PasswordHelper.HashPassword(credentials.Password),
                    Email = createAppointmentByReceptionistDTO.Email,
                    DateOfBirth = createAppointmentByReceptionistDTO.DateOfBirth,
                    Gender = createAppointmentByReceptionistDTO.Gender,
                    PhoneNumber = createAppointmentByReceptionistDTO.PhoneNumber,
                    Address = createAppointmentByReceptionistDTO.Address,
                    Status = UserStatusEnum.Active,
                    UserRoles = new List<UserRole>
                    {
                       new UserRole { RoleId = patientRole.RoleId }
                    }
                };

                await _unitOfWork.UsersRepository.AddAsync(newUser);
                await _unitOfWork.SaveChangeAsync();

                // 4. Tạo lịch khám bệnh
                var appointment = new Appointment
                {
                    PatientId = newUser.UserId,
                    DoctorId = createAppointmentByReceptionistDTO.DoctorId,
                    SpecialtyId = createAppointmentByReceptionistDTO.SpecialtyId,
                    AppointmentDate = createAppointmentByReceptionistDTO.AppointmentDate.Date,
                    AppointmentCode = await GenerateRandomAppointmentCodeAsync(),
                    StartTime = createAppointmentByReceptionistDTO.StartTime,
                    EndTime = createAppointmentByReceptionistDTO.EndTime,
                    Note = createAppointmentByReceptionistDTO.Note,
                    Status = AppointmentStatusEnum.Booked
                };

                await _unitOfWork.AppoinmentRepository.AddAsync(appointment);
                await _unitOfWork.SaveChangeAsync();

                // 5. Gọi service gửi email thông báo tài khoản & lịch hẹn
                var doctor = await _unitOfWork.UsersRepository.GetByIdAsync(createAppointmentByReceptionistDTO.DoctorId);
                var specialty = await _unitOfWork.SpecialtyRepository.GetByIdAsync(createAppointmentByReceptionistDTO.SpecialtyId);

                var emailDto = new RegisterAndAppointmentEmailDTO
                {
                    ToEmail = createAppointmentByReceptionistDTO.Email,
                    FullName = createAppointmentByReceptionistDTO.FullName,
                    Username = credentials.Username,
                    Password = credentials.Password,
                    DoctorName = doctor?.FullName ?? "Bác sĩ",
                    SpecialtyName = specialty?.Name ?? "Chuyên khoa",
                    AppointmentDate = createAppointmentByReceptionistDTO.AppointmentDate,
                    StartTime = createAppointmentByReceptionistDTO.StartTime,
                    EndTime = createAppointmentByReceptionistDTO.EndTime,
                    AppointmentCode = appointment.AppointmentCode,
                };

                var emailSent = await _emailService.SendEmailRegisterAndAppointmentAsync(emailDto);

                if (!emailSent)
                {
                    Console.WriteLine("Warning: Gửi email thông báo không thành công.");
                }

                return ResponseHandler.Success(true, "Tạo lịch hẹn và tài khoản bệnh nhân thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

    }
}
