using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.SpecialtyDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/specialty")]
    [ApiController]
    public class SpecialtyController : ControllerBase
    {
        private readonly ISpecialtyService _specialtyService;

        public SpecialtyController(ISpecialtyService specialtyService)
        {
            _specialtyService = specialtyService;
        }

        [SwaggerOperation(Summary = "Phân quyền: Admin")]
        [HttpPost]
        public async Task<ApiResponse<bool>> CreateSpecialtyAsync([FromBody] CreateSpecialtyDTO createSpecialtyDTO)
        {
            return await _specialtyService.CreateSpecialtyAsync(createSpecialtyDTO);
        }

        [SwaggerOperation(Summary = "Phân quyền: Admin")]
        [HttpDelete("{specialtyId}")]
        public async Task<ApiResponse<bool>> DeleteSpecialtyByIdAsync(Guid specialtyId)
        {
            return await _specialtyService.DeleteSpecialtyByIdAsync(specialtyId);
        }

        [SwaggerOperation(Summary = "Phân quyền: Admin")]
        [HttpPut("{specialtyId}")]
        public async Task<ApiResponse<bool>> UpdateSpecialtyByIdAsync(Guid specialtyId, [FromBody] UpdateSpecialtyDTO updateSpecialtyDTO)
        {
            return await _specialtyService.UpdateSpecialtyByIdAsync(specialtyId, updateSpecialtyDTO);
        }

        [SwaggerOperation(Summary = "Phân quyền: Admin, Patient")]
        [HttpGet]
        public async Task<ApiResponse<List<GetSpecialtyDTO>>> GetAllSpecialtyAsync()
        {
            return await _specialtyService.GetAllSpecialtyAsync();
        }
    }
}
