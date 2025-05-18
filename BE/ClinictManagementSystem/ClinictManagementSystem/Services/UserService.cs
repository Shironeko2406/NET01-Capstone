using Azure.Core;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Helper;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.DTO.UsersDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Linq.Expressions;
using System.Text;

namespace ClinictManagementSystem.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;
        private readonly IClaimsService _claimsService;
        public UserService(IUnitOfWork unitOfWork, IEmailService emailService, IClaimsService claimsService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
            _claimsService = claimsService;
        }

        public async Task<ApiResponse<bool>> RegisterPatientAsync(RegisterPatientDTO registerPatientDTO)
        {
            try
            {
                // Kiểm tra username hoặc email đã tồn tại
                var existingUser = await _unitOfWork.UsersRepository.GetByUsernameOrEmailAsync(registerPatientDTO.Username, registerPatientDTO.Email);
                if (existingUser != null)
                {
                    return ResponseHandler.Failure<bool>("Username or Email already exists.");
                }

                // Tìm role Patient
                var patientRole = await _unitOfWork.RoleRepository.GetByNameAsync(AppRole.Patient);
                if (patientRole == null)
                {
                    return ResponseHandler.Failure<bool>("Patient role not found.");
                }

                // Băm mật khẩu
                var hashedPassword = PasswordHelper.HashPassword(registerPatientDTO.Password);

                // Tạo user mới
                var newUser = new Users
                {
                    FullName = registerPatientDTO.FullName,
                    Username = registerPatientDTO.Username,
                    PasswordHash = hashedPassword,
                    Email = registerPatientDTO.Email,
                    Avatar = registerPatientDTO.Avatar,
                    DateOfBirth = registerPatientDTO.DateOfBirth,
                    Gender = registerPatientDTO.Gender,
                    PhoneNumber = registerPatientDTO.PhoneNumber,
                    Address = registerPatientDTO.Address,
                    Status = UserStatusEnum.Active,
                    UserRoles = new List<UserRole>
                    {
                        new UserRole
                        {
                            RoleId = patientRole.RoleId
                        }
                    }
                };

                await _unitOfWork.UsersRepository.AddAsync(newUser);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Patient registered successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error occurred: {ex.Message}");
            }
        }

        public async Task<UserLoginRequestDTO> GenerateUserCredentials(string fullname)
        {
            var normalizedString = fullname.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }
            fullname = stringBuilder.ToString();
            var words = fullname.Split(' ');
            string lastName = words.Last();


            var initials = string.Concat(words.Take(words.Length - 1).Select(n => n[0]));
            var year = DateTime.Now.Year.ToString().Substring(2);
            var month = DateTime.Now.Month.ToString();
            var username = lastName + initials + year + month;
            var counter = 1;
            while (await _unitOfWork.UsersRepository.CheckUserNameExistAsync(username))
            {
                username = lastName + initials + year + month + counter;
                counter++;
            }
            var random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var password = new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[random.Next(s.Length)]).ToArray());

            return new UserLoginRequestDTO { Password = password, Username = username };
        }

        public async Task<ApiResponse<bool>> CreateUserAccountInternalAsync(CreateUserAccountInternalDTO createUserAccountInternalDTO)
        {
            try
            {
                // 1. Tạo username và password
                var credentials = await GenerateUserCredentials(createUserAccountInternalDTO.FullName);

                // 3. Tìm role
                var role = await _unitOfWork.RoleRepository.GetByNameAsync(createUserAccountInternalDTO.RoleName);
                if (role == null)
                {
                    return ResponseHandler.Failure<bool>("Role not found");
                }

                // 4. Tạo user
                var newUser = new Users
                {
                    FullName = createUserAccountInternalDTO.FullName,
                    Username = credentials.Username,
                    PasswordHash = PasswordHelper.HashPassword(credentials.Password),
                    Email = createUserAccountInternalDTO.Email,
                    Avatar = createUserAccountInternalDTO.Avatar,
                    DateOfBirth = createUserAccountInternalDTO.DateOfBirth,
                    Gender = createUserAccountInternalDTO.Gender,
                    PhoneNumber = createUserAccountInternalDTO.PhoneNumber,
                    Address = createUserAccountInternalDTO.Address,
                    Status = UserStatusEnum.Active,
                    UserRoles = new List<UserRole>
                    {
                        new UserRole { RoleId = role.RoleId }
                    }
                };

                await _unitOfWork.UsersRepository.AddAsync(newUser);

                // 5. Nếu là Doctor thì thêm chuyên khoa
                if (role.RoleName == AppRole.Doctor && createUserAccountInternalDTO.SpecialtyIds != null)
                {
                    foreach (var specialtyId in createUserAccountInternalDTO.SpecialtyIds)
                    {
                        var doctorSpecialty = new DoctorSpecialties
                        {
                            DoctorId = newUser.UserId,
                            SpecialtyId = specialtyId
                        };
                        await _unitOfWork.DoctorSpecialtyRepository.AddDoctorSpecialtyAsync(doctorSpecialty);
                    }
                }

                await _unitOfWork.SaveChangeAsync();

                await _emailService.SendEmailRegisterUserAsync(
                    createUserAccountInternalDTO.Email,
                    createUserAccountInternalDTO.FullName,
                    credentials.Username,
                    credentials.Password
                );

                return ResponseHandler.Success(true, "Tạo thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Pagination<GetUsersDTO>>> FilterUserByAdminAsync(FilterUsersDTO filterUsersDTO)
        {
            var response = new ApiResponse<Pagination<GetUsersDTO>>();
            try
            {
                // 1. Tạo filter condition
                var filter = (Expression<Func<Users, bool>>)(u =>
                    string.IsNullOrEmpty(filterUsersDTO.Search) ||
                    u.FullName.Contains(filterUsersDTO.Search) ||
                    u.Username.Contains(filterUsersDTO.Search) ||
                    u.Email.Contains(filterUsersDTO.Search) ||
                    u.PhoneNumber.Contains(filterUsersDTO.Search)
                );

                // 2. Gọi repository
                var usersPagination = await _unitOfWork.UsersRepository.GetFilterUserAsync(
                    filter: filter,
                    role: filterUsersDTO.Role.ToString(),
                    pageIndex: filterUsersDTO.PageIndex,
                    pageSize: filterUsersDTO.PageSize
                );

                // 3. Map tay từ Users -> GetUsersDTO
                var userDTOs = usersPagination.Items?.Select(u => new GetUsersDTO
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Username = u.Username,
                    Email = u.Email,
                    Avatar = u.Avatar,
                    DateOfBirth = u.DateOfBirth,
                    Gender = u.Gender.ToString(),
                    PhoneNumber = u.PhoneNumber,
                    Address = u.Address,
                    Roles = u.UserRoles?.Select(ur => ur.Role.RoleName).ToList()
                }).ToList();

                // 4. Tạo pagination mới cho DTO
                var result = new Pagination<GetUsersDTO>
                {
                    PageIndex = usersPagination.PageIndex,
                    PageSize = usersPagination.PageSize,
                    TotalItemsCount = usersPagination.TotalItemsCount,
                    Items = userDTOs
                };

                // 5. Trả kết quả
                if (userDTOs == null || !userDTOs.Any())
                    return ResponseHandler.Success(result, "Không tìm thấy người dùng phù hợp!");

                return ResponseHandler.Success(result);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetUsersDTO>>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<UserDetailDTO>> GetUserByLoginAsync()
        {
            try
            {
                var userId = _claimsService.GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return ResponseHandler.Failure<UserDetailDTO>("Token không hợp lệ hoặc người dùng không đăng nhập.");
                }

                var user = await _unitOfWork.UsersRepository.GetUserById(userId);

                if (user == null)
                {
                    return ResponseHandler.Failure<UserDetailDTO>("Không tìm thấy người dùng.");
                }

                var userDetail = new UserDetailDTO
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Username = user.Username,
                    Email = user.Email,
                    Avatar = user.Avatar,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender.ToString(),
                    PhoneNumber = user.PhoneNumber,
                    Address = user.Address,
                    Roles = user.UserRoles?.Select(ur => ur.Role.RoleName).ToList(),
                    Specialties = user.DoctorSpecialties?.Any() == true
                        ? user.DoctorSpecialties.Select(ds => ds.Specialty.Name).ToList()
                        : null
                };

                return ResponseHandler.Success(userDetail, "Lấy thông tin người dùng thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<UserDetailDTO>($"Lỗi khi lấy thông tin người dùng: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateUserLoginAsync(UpdateUserDTO updateUserDTO)
        {
            try
            {
                var userId = _claimsService.GetCurrentUserId();
                if (userId == Guid.Empty)
                {
                    return ResponseHandler.Failure<bool>("Token không hợp lệ hoặc người dùng không đăng nhập.");
                }

                var user = await _unitOfWork.UsersRepository.GetByIdAsync(userId);
                if (user == null)
                {
                    return ResponseHandler.Failure<bool>("Không tìm thấy người dùng.");
                }

                // Cập nhật thông tin người dùng
                user.FullName = updateUserDTO.FullName;
                user.Email = updateUserDTO.Email;
                user.Avatar = updateUserDTO.Avatar;
                user.DateOfBirth = updateUserDTO.DateOfBirth;
                user.Gender = updateUserDTO.Gender;
                user.PhoneNumber = updateUserDTO.PhoneNumber;
                user.Address = updateUserDTO.Address;

                _unitOfWork.UsersRepository.UpdateAsync(user);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Cập nhật thông tin người dùng thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Lỗi khi cập nhật thông tin người dùng: {ex.Message}");
            }
        }

    }
}
