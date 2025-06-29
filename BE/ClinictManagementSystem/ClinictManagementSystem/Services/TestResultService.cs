using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.TestResultDTO;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class TestResultService : ITestResultService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IClaimsService _claimsService;
        private readonly ICurrentTime _currentTime;

        public TestResultService(IUnitOfWork unitOfWork, IClaimsService claimsService, ICurrentTime currentTime)
        {
            _unitOfWork = unitOfWork;
            _claimsService = claimsService;
            _currentTime = currentTime;
        }

        public async Task<ApiResponse<bool>> UpdateTestResultAsync(Guid testResultId, UpdateTestResultDTO updateTestResultDTO)
        {
            try
            {
                var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(testResultId);
                if (testResult == null)
                    return ResponseHandler.Failure<bool>("Không tìm thấy kết quả xét nghiệm.");

                testResult.Result = updateTestResultDTO.Result;
                testResult.ResultDate = _currentTime.GetCurrentTime();
                var userId = _claimsService.GetCurrentUserId(); 
                testResult.UpdateBy = userId;

                await _unitOfWork.TestResultRepository.UpdateAsync(testResult);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Cập nhật kết quả xét nghiệm thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }
    }
}
