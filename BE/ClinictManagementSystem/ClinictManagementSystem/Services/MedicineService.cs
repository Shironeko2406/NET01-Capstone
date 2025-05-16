using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace ClinictManagementSystem.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MedicineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO)
        {
            try
            {
                var medicine = new Medicines
                {
                    Name = createMedicineDTO.Name,
                    Description = createMedicineDTO.Description,
                    MedicineTypeId = createMedicineDTO.MedicineTypeId,
                    Unit = createMedicineDTO.Unit,
                    Price = createMedicineDTO.Price,
                    StockQuantity = createMedicineDTO.StockQuantity,
                    MinQuantity = createMedicineDTO.MinQuantity,
                };

                await _unitOfWork.MedicineRepository.AddAsync(medicine);

                var history = new MedicineStockHistory
                {
                    MedicineId = medicine.MedicineId,
                    Quantity = createMedicineDTO.StockQuantity,
                    Type = MedicineStockHistoryTypeEnum.Import,
                    Note = "Tạo mới thuốc và nhập kho",
                };

                await _unitOfWork.MedicineStockHistoryRepository.AddAsync(history);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Tạo thuốc thành công và đã ghi lịch sử kho!");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }
    }
}
