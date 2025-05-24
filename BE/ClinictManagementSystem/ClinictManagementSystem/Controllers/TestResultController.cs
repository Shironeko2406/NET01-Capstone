using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppoinmentDTO;
using ClinictManagementSystem.Models.DTO.TestResultDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/test-result")]
    [ApiController]
    public class TestResultController : ControllerBase
    {
        private readonly ITestResultService _testResultService;

        public TestResultController(ITestResultService testResultService)
        {
            _testResultService = testResultService;
        }

        [SwaggerOperation(Summary = "Cập nhật kết quả xét nghiệm")]
        [Authorize(Roles = AppRole.LabTechnician)]
        [HttpPut("{testResultId}")]
        public async Task<ApiResponse<bool>> UpdateTestResultAsync(Guid testResultId, [FromBody] UpdateTestResultDTO updateTestResultDTO)
        {
            return await _testResultService.UpdateTestResultAsync(testResultId, updateTestResultDTO);
        }
    }
}
