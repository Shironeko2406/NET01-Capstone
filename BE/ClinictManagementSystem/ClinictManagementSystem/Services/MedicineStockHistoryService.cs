using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using System.Linq.Expressions;

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

        public async Task<string> GenerateTransactionCodeAsync()
        {
            string code;
            do
            {
                var randomPart = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper(); 
                code = $"TRX-{randomPart}";
            }
            while (await _unitOfWork.MedicineStockHistoryRepository.AnyAsync(h => h.TransactionCode == code));

            return code;
        }

        public async Task<ApiResponse<Pagination<GetMedicineStockHistoryDTO>>> GetMedicineStockHistoryFilterAsync(MedicineStockHistoryFilterDTO medicineStockHistoryFilterDTO)
        {
            try
            {
                // Build filter expression
                Expression<Func<MedicineStockHistory, bool>> filter = x =>
                    (string.IsNullOrEmpty(medicineStockHistoryFilterDTO.Search) ||
                        x.TransactionCode.Contains(medicineStockHistoryFilterDTO.Search) ||
                        x.Medicine.MedicineCode.Contains(medicineStockHistoryFilterDTO.Search) ||
                        x.Medicine.Name.Contains(medicineStockHistoryFilterDTO.Search) ||
                        x.CreatedByUser.Username.Contains(medicineStockHistoryFilterDTO.Search)) &&

                    (!medicineStockHistoryFilterDTO.Type.HasValue || x.Type == medicineStockHistoryFilterDTO.Type.Value) &&
                    (!medicineStockHistoryFilterDTO.FromDate.HasValue || x.CreationDate >= medicineStockHistoryFilterDTO.FromDate.Value) &&
                    (!medicineStockHistoryFilterDTO.ToDate.HasValue || x.CreationDate <= medicineStockHistoryFilterDTO.ToDate.Value);

                // Sorting
                Func<IQueryable<MedicineStockHistory>, IOrderedQueryable<MedicineStockHistory>>? orderBy = null;
                if (medicineStockHistoryFilterDTO.SortBy.HasValue)
                {
                    bool ascending = medicineStockHistoryFilterDTO.SortBy == SortEnum.Ascending;
                    orderBy = ascending
                        ? q => q.OrderBy(x => x.CreationDate)
                        : q => q.OrderByDescending(x => x.CreationDate);
                }

                string includes = "Medicine,CreatedByUser";

                var result = await _unitOfWork.MedicineStockHistoryRepository.GetFilterAsync(
                    filter: filter,
                    orderBy: orderBy,
                    includeProperties: includes,
                    pageIndex: medicineStockHistoryFilterDTO.PageIndex,
                    pageSize: medicineStockHistoryFilterDTO.PageSize
                );

                var mappedItems = result.Items.Select(x => new GetMedicineStockHistoryDTO
                {
                    MedicineStockHistoryId = x.MedicineStockHistoryId,
                    MedicineId = x.MedicineId,
                    MedicineName = x.Medicine?.Name,
                    TransactionCode = x.TransactionCode,
                    MedicineCode = x.Medicine.MedicineCode,
                    Quantity = x.Quantity,
                    Type = x.Type,
                    Note = x.Note,
                    CreationDate = x.CreationDate,
                    CreatedByName = x.CreatedByUser.Username 
                }).ToList();

                var response = new Pagination<GetMedicineStockHistoryDTO>
                {
                    PageIndex = result.PageIndex,
                    PageSize = result.PageSize,
                    TotalItemsCount = result.TotalItemsCount,
                    Items = mappedItems
                };

                if (!mappedItems.Any())
                    return ResponseHandler.Success(response, "Không có lịch sử giao dịch phù hợp!");

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetMedicineStockHistoryDTO>>("Lỗi khi lọc lịch sử kho thuốc: " + ex.Message);
            }
        }

    }
}
