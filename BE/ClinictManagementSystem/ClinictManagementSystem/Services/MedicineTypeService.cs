using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineTypeDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class MedicineTypeService : IMedicineTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MedicineTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateMedicineTypeAsync(CreateMedicineTypeDTO createMedicineTypeDTO)
        {
            try
            {
                var medicineType = new MedicineType
                {
                    Name = createMedicineTypeDTO.Name,
                };

                await _unitOfWork.MedicineTypeRepository.AddAsync(medicineType);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Medicine type created successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteMedicineTypeByIdAsync(Guid medicineTypeId)
        {
            try
            {
                var medicineType = await _unitOfWork.MedicineTypeRepository.GetByIdAsync(medicineTypeId);
                if (medicineType == null)
                {
                    return ResponseHandler.Failure<bool>("Medicine type not found.");
                }

                _unitOfWork.MedicineTypeRepository.SoftDelete(medicineType);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Medicine type deleted successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<MedicineTypeGetDTO>>> GetAllMedicineTypesAsync()
        {
            try
            {
                var medicineTypes = await _unitOfWork.MedicineTypeRepository.GetAllAsync();

                var medicineTypeDtos = medicineTypes.Select(m => new MedicineTypeGetDTO
                {
                    MedicineTypeId = m.MedicineTypeId,
                    Name = m.Name,
                }).ToList();

                return ResponseHandler.Success(medicineTypeDtos, "Lấy danh sách tất cả loại thuốc thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<MedicineTypeGetDTO>>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateMedicineTypeByIdAsync(Guid medicineTypeId, UpdateMedicineTypeDTO updateMedicineTypeDTO)
        {
            try
            {
                var medicineType = await _unitOfWork.MedicineTypeRepository.GetByIdAsync(medicineTypeId);

                if (medicineType == null || medicineType.IsDeleted)
                {
                    return ResponseHandler.Failure<bool>("Medicine type not found.");
                }

                // Gán lại giá trị mới từ DTO
                medicineType.Name = updateMedicineTypeDTO.Name;

                _unitOfWork.MedicineTypeRepository.UpdateAsync(medicineType);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Medicine type updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }
    }
}
