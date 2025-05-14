using AutoMapper;
using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.ServiceDTO;
using ClinictManagementSystem.Models.DTO.SpecialtyDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class SpecialtyService : ISpecialtyService
    {
        private readonly IUnitOfWork _unitOfWork;

        public SpecialtyService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateSpecialtyAsync(CreateSpecialtyDTO createSpecialtyDTO)
        {
            try
            {
                var specialty = new Specialties
                {
                    Name = createSpecialtyDTO.Name,
                    Description = createSpecialtyDTO.Description,
                };

                await _unitOfWork.SpecialtyRepository.AddAsync(specialty);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Specialty created successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteSpecialtyByIdAsync(Guid specialtyId)
        {
            try
            {
                var specialty = await _unitOfWork.SpecialtyRepository.GetByIdAsync(specialtyId);
                if (specialty == null)
                {
                    return ResponseHandler.Failure<bool>("Specialty not found.");
                }

                _unitOfWork.SpecialtyRepository.SoftDelete(specialty);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Specialty deleted successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<GetSpecialtyDTO>>> GetAllSpecialtyAsync()
        {
            try
            {
                var specialties = await _unitOfWork.SpecialtyRepository.GetAllAsync();

                var specialtyDtos = specialties.Select(s => new GetSpecialtyDTO
                {
                    SpecialtyId = s.SpecialtyId,
                    Name = s.Name,
                    Description = s.Description
                }).ToList();

                return ResponseHandler.Success(specialtyDtos, "Lấy danh sách tất cả chuyên khoa thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<GetSpecialtyDTO>>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateSpecialtyByIdAsync(Guid specialtyId, UpdateSpecialtyDTO updateSpecialtyDTO)
        {
            try
            {
                var specialty = await _unitOfWork.SpecialtyRepository.GetByIdAsync(specialtyId);

                if (specialty == null || specialty.IsDeleted)
                {
                    return ResponseHandler.Failure<bool>("Specialty not found.");
                }

                // Gán lại giá trị mới từ DTO
                specialty.Name = updateSpecialtyDTO.Name;
                specialty.Description = updateSpecialtyDTO.Description;

                _unitOfWork.SpecialtyRepository.UpdateAsync(specialty);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Specialty updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }
    }
}
