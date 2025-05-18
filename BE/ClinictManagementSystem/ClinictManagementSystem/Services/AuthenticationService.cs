using AutoMapper;
using Azure;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Helper;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.UsersDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using Microsoft.AspNetCore.Identity;

namespace ClinictManagementSystem.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRedisService _redisService;
        private readonly ICurrentTime _currentTime;
        private readonly IJWTService _jwtService;

        public AuthenticationService(
            IUnitOfWork unitOfWork,
            ICurrentTime currentTime,
            IJWTService jwtService,
            IRedisService redisService)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _redisService = redisService;
            _jwtService = jwtService;
        }
        public async Task<ApiResponse<UserLoginResponseDTO>> LoginAsync(UserLoginRequestDTO userLoginRequest)
        {
            try
            {
                var user = await _unitOfWork.UsersRepository.GetUserByUserName(userLoginRequest.Username);
                if (user == null)
                {
                    return ResponseHandler.LogicFailure<UserLoginResponseDTO>("Người dùng không tồn tại trong hệ thống.");
                }
                var isPasswordValid = PasswordHelper.VerifyPassword(userLoginRequest.Password, user.PasswordHash);
                if (!isPasswordValid)
                {
                    return ResponseHandler.LogicFailure<UserLoginResponseDTO>("Mật khẩu không chính xác.");
                }

                var token = _jwtService.GenerateJWT(user);

                var response = new UserLoginResponseDTO
                {
                    AccessToken = token
                };

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<UserLoginResponseDTO>($"An error occurred: {ex.Message}");
            }
        }
    }
}
