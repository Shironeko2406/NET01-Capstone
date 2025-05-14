using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ClinictManagementSystem.Controllers
{
    [Route("api/v1/service")]
    public class ServiceController : ControllerBase
    {
        private readonly IServiceClinict _serviceClinict;

        public ServiceController(IServiceClinict serviceClinict)
        {
            _serviceClinict = serviceClinict;
        }
        [HttpPost]
        //[SwaggerOperation(Summary = "Tạo mới đơn thuốc")]
        public async Task<ApiResponse<bool>> CreateServciceAsync(CreateServiceDTO createServiceDTO)
        {
            return await _serviceClinict.CreateServciceAsync(createServiceDTO);
        }

        [HttpDelete("{serviceId}")]
        public async Task<ApiResponse<bool>> DeleteServiceByIdAsync(Guid serviceId)
        {
            return await _serviceClinict.DeleteServiceByIdAsync(serviceId);
        }

        [HttpPut("{serviceId}")]
        public async Task<ApiResponse<bool>> UpdateServiceByIdAsync(Guid serviceId, UpdateServiceDTO updateServiceDto)
        {
            return await _serviceClinict.UpdateServiceByIdAsync(serviceId ,updateServiceDto);
        }

        [HttpGet]
        public async Task<ApiResponse<Pagination<GetServiceDTO>>> GetServiceAsync([FromQuery] ServiceFiltercs serviceFiltercs)
        {
            return await _serviceClinict.GetServiceAsync(serviceFiltercs);
        }

        [HttpGet("all")]
        public async Task<ApiResponse<List<GetAllServiceDTO>>> GetAllServiceAsync()
        {
            return await _serviceClinict.GetAllServiceAsync();
        }

    }
}
