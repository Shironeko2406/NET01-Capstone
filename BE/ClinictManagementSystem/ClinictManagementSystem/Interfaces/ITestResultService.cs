using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.TestResultDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface ITestResultService
    {
        Task<ApiResponse<bool>> UpdateTestResultAsync(Guid testResultId, UpdateTestResultDTO updateTestResultDTO);
    }
}
