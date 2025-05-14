using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Models.DTO.ServiceDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IServiceClinict
    {
        Task<ApiResponse<bool>> CreateServciceAsync(CreateServiceDTO createServiceDTO);
        Task<ApiResponse<bool>> DeleteServiceByIdAsync(Guid serviceId);
        Task<ApiResponse<bool>> UpdateServiceByIdAsync(Guid serviceId, UpdateServiceDTO updateServiceDto);
        Task<ApiResponse<Pagination<GetServiceDTO>>> GetServiceAsync(ServiceFiltercs serviceFiltercs);
        Task<ApiResponse<List<GetAllServiceDTO>>> GetAllServiceAsync();

    }
}
