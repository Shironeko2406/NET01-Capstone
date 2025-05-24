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

        public TestResultService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ApiResponse<bool>> UpdateTestResultAsync(Guid testResultId, UpdateTestResultDTO updateTestResultDTO)
        {
            try
            {
                var testResult = await _unitOfWork.TestResultRepository.GetByIdAsync(testResultId);
                if (testResult == null)
                    return ResponseHandler.Failure<bool>("Test result not found.");

                testResult.Result = updateTestResultDTO.Result;
                testResult.ResultDate = updateTestResultDTO.ResultDate;

                await _unitOfWork.TestResultRepository.UpdateAsync(testResult);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Test result updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }
    }
}
