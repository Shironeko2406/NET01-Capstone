using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class MedicineStockHistoryService : IMedicineStockHistoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MedicineStockHistoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateMedicineHistoryStockAsync(CreateMedicineManageStockDTO createMedicineManageStockDTO)
        {
            try
            {
                var medicine = await _unitOfWork.MedicineRepository.GetByIdAsync(createMedicineManageStockDTO.MedicineId);

                if (medicine == null)
                {
                    return ResponseHandler.Failure<bool>("Thuốc không tồn tại.");
                }

                int stockChange = 0;

                switch (createMedicineManageStockDTO.Type)
                {
                    case MedicineStockHistoryTypeEnum.Import:
                        stockChange = createMedicineManageStockDTO.Quantity;
                        medicine.StockQuantity += stockChange;
                        break;

                    case MedicineStockHistoryTypeEnum.Export:
                        stockChange = -createMedicineManageStockDTO.Quantity;
                        if (medicine.StockQuantity < createMedicineManageStockDTO.Quantity)
                        {
                            return ResponseHandler.Failure<bool>("Không đủ thuốc để xuất kho.");
                        }
                        medicine.StockQuantity += stockChange;
                        break;

                    case MedicineStockHistoryTypeEnum.Adjust:
                        stockChange = createMedicineManageStockDTO.Quantity - medicine.StockQuantity;
                        medicine.StockQuantity = createMedicineManageStockDTO.Quantity;
                        break;

                    default:
                        return ResponseHandler.Failure<bool>("Loại thao tác kho không hợp lệ.");
                }

                var history = new MedicineStockHistory
                {
                    MedicineId = createMedicineManageStockDTO.MedicineId,
                    Quantity = stockChange,
                    Type = createMedicineManageStockDTO.Type,
                    Note = createMedicineManageStockDTO.Note,
                };

                await _unitOfWork.MedicineStockHistoryRepository.AddAsync(history);
                _unitOfWork.MedicineRepository.UpdateAsync(medicine);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Thao tác kho thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }
    }
}
