using AutoMapper;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Services
{
    public class ServiceClinict : IServiceClinict
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServiceClinict(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateServciceAsync(CreateServiceDTO createServiceDTO)
        {
            try
            {
                var service = new Service
                {
                    Name = createServiceDTO.Name,
                    Price = createServiceDTO.Price,
                    Description = createServiceDTO.Description,
                };

                await _unitOfWork.ServiceRepository.AddAsync(service);

                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Service created successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteServiceByIdAsync(Guid serviceId)
        {
            try
            {
                var service = await _unitOfWork.ServiceRepository.GetByIdAsync(serviceId);

                if (service == null || service.IsDeleted)
                {
                    return ResponseHandler.Failure<bool>("Service not found.");
                }

                _unitOfWork.ServiceRepository.SoftDelete(service);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Service deleted successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<GetAllServiceDTO>>> GetAllServiceAsync()
        {
            try
            {
                var services = await _unitOfWork.ServiceRepository.GetAllAsync();

                var serviceDtos = services.Select(s => new GetAllServiceDTO
                {
                    ServiceId = s.ServiceId, 
                    Name = s.Name
                }).ToList();

                return ResponseHandler.Success(serviceDtos, "Lấy danh sách tất cả dịch vụ thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<GetAllServiceDTO>>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<GetServiceDTO>>> GetServiceAsync()
        {
            try
            {
                // Lấy tất cả dịch vụ chưa bị xóa
                var services = await _unitOfWork.ServiceRepository
                    .FindAsync(s => !s.IsDeleted);

                // Chuyển sang DTO
                var result = services.Select(s => new GetServiceDTO
                {
                    ServiceId = s.ServiceId,
                    Name = s.Name,
                    Price = s.Price,
                    Description = s.Description
                    // Thêm các trường khác nếu cần
                }).ToList();

                return ResponseHandler.Success(result, "Get all services successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<GetServiceDTO>>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<Pagination<GetServiceDTO>>> GetServiceAsync(ServiceFiltercs serviceFiltercs)
        {
            try
            {
                Expression<Func<Service, bool>> filter = s =>
                    string.IsNullOrWhiteSpace(serviceFiltercs.SearchKeyword)
                    || s.Name.Contains(serviceFiltercs.SearchKeyword);

                var services = await _unitOfWork.ServiceRepository.GetFilterAsync(
                    filter: filter,
                    pageIndex: serviceFiltercs.PageIndex,
                    pageSize: serviceFiltercs.PageSize
                );

                // Map thủ công từ Service sang GetServiceDTO
                var mappedItems = services.Items?.Select(s => new GetServiceDTO
                {
                    ServiceId = s.ServiceId,
                    Name = s.Name,
                    Description = s.Description,
                    Price = s.Price,
                    // Thêm các trường khác nếu có
                }).ToList();

                var serviceDtos = new Pagination<GetServiceDTO>
                {
                    Items = mappedItems,
                    PageIndex = services.PageIndex,
                    PageSize = services.PageSize,
                    TotalItemsCount = services.TotalItemsCount
                };

                return ResponseHandler.Success(serviceDtos, "Lấy danh sách dịch vụ thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetServiceDTO>>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateServiceByIdAsync(Guid serviceId, UpdateServiceDTO updateServiceDto)
        {
            try
            {
                var service = await _unitOfWork.ServiceRepository.GetByIdAsync(serviceId);
                if (service?.IsDeleted != false)
                    return ResponseHandler.Failure<bool>("Service not found.");

                service.Name = updateServiceDto.Name;
                service.Price = updateServiceDto.Price;
                service.Description = updateServiceDto.Description;

                _unitOfWork.ServiceRepository.UpdateAsync(service);

                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Service updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }
    }
}
