using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.MedicineDTO;
using ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace ClinictManagementSystem.Services
{
    public class MedicineService : IMedicineService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedicineStockHistoryService _medicineStockHistoryService;
        public MedicineService(IUnitOfWork unitOfWork, IMedicineStockHistoryService medicineStockHistoryService)
        {
            _unitOfWork = unitOfWork;
            _medicineStockHistoryService = medicineStockHistoryService;
        }
        public async Task<ApiResponse<bool>> CreateMedicineAsync(CreateMedicineDTO createMedicineDTO)
        {
            try
            {
                var medicine = new Medicines
                {
                    Name = createMedicineDTO.Name,
                    Description = createMedicineDTO.Description,
                    MedicineCode = await GenerateMedicineCodeAsync(),
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
                    TransactionCode = await _medicineStockHistoryService.GenerateTransactionCodeAsync(),
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

        public async Task<string> GenerateMedicineCodeAsync()
        {
            string code;
            do
            {
                var randomPart = Guid.NewGuid().ToString("N").Substring(0, 6).ToUpper(); // 6 ký tự
                code = $"MED-{randomPart}";
            }
            while (await _unitOfWork.MedicineRepository.AnyAsync(m => m.MedicineCode == code));

            return code;
        }

        public async Task<ApiResponse<Pagination<GetMedicineFilterDTO>>> GetMedicineFilterAsync(FilterMedicineDTO filterMedicineDTO)
        {
            try
            {
                // Xây dựng biểu thức lọc
                Expression<Func<Medicines, bool>> filter = x =>
                    (string.IsNullOrEmpty(filterMedicineDTO.Search) ||
                        x.MedicineCode.Contains(filterMedicineDTO.Search) ||
                        x.Name.Contains(filterMedicineDTO.Search) ||
                        x.Description.Contains(filterMedicineDTO.Search) ||
                        x.MedicineType.Name.Contains(filterMedicineDTO.Search)) &&

                    (!filterMedicineDTO.MedicineTypeId.HasValue || x.MedicineTypeId == filterMedicineDTO.MedicineTypeId.Value) &&

                    (!filterMedicineDTO.Status.HasValue ||
                        (filterMedicineDTO.Status == MedicineStatusEnum.InStock && x.StockQuantity > x.MinQuantity) ||
                        (filterMedicineDTO.Status == MedicineStatusEnum.LowStock && x.StockQuantity > 0 && x.StockQuantity <= x.MinQuantity) ||
                        (filterMedicineDTO.Status == MedicineStatusEnum.OutOfStock && x.StockQuantity == 0));

                // Logic sắp xếp
                Func<IQueryable<Medicines>, IOrderedQueryable<Medicines>>? orderBy = null;

                if (filterMedicineDTO.SortBy.HasValue && filterMedicineDTO.SortField.HasValue)
                {
                    bool ascending = filterMedicineDTO.SortBy == SortEnum.Ascending;

                    switch (filterMedicineDTO.SortField.Value)
                    {
                        case SortFieldMedicineEnum.Name:
                            orderBy = ascending
                                ? q => q.OrderBy(m => m.Name)
                                : q => q.OrderByDescending(m => m.Name);
                            break;

                        case SortFieldMedicineEnum.Price:
                            orderBy = ascending
                                ? q => q.OrderBy(m => m.Price)
                                : q => q.OrderByDescending(m => m.Price);
                            break;

                        case SortFieldMedicineEnum.StockQuantity:
                            orderBy = ascending
                                ? q => q.OrderBy(m => m.StockQuantity)
                                : q => q.OrderByDescending(m => m.StockQuantity);
                            break;
                    }
                }

                string include = "MedicineType";

                var result = await _unitOfWork.MedicineRepository.GetFilterAsync(
                    filter: filter,
                    orderBy: orderBy,
                    includeProperties: include,
                    pageIndex: filterMedicineDTO.PageIndex,
                    pageSize: filterMedicineDTO.PageSize
                );

                var mappedItems = result.Items.Select(x => new GetMedicineFilterDTO
                {
                    MedicineId = x.MedicineId,
                    MedicineCode = x.MedicineCode,
                    Name = x.Name,
                    MedicineTypeId = x.MedicineTypeId,
                    MedicineTypeName = x.MedicineType?.Name ?? string.Empty,
                    Unit = x.Unit,
                    Price = x.Price,
                    StockQuantity = x.StockQuantity,
                    MinQuantity = x.MinQuantity,
                    Status = x.StockQuantity == 0
                                ? MedicineStatusEnum.OutOfStock
                                : (x.StockQuantity <= x.MinQuantity
                                    ? MedicineStatusEnum.LowStock
                                    : MedicineStatusEnum.InStock)
                }).ToList();

                var response = new Pagination<GetMedicineFilterDTO>
                {
                    PageIndex = result.PageIndex,
                    PageSize = result.PageSize,
                    TotalItemsCount = result.TotalItemsCount,
                    Items = mappedItems
                };

                if (!mappedItems.Any())
                    return ResponseHandler.Success(response, "Không tìm thấy thuốc phù hợp!");

                return ResponseHandler.Success(response);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<Pagination<GetMedicineFilterDTO>>("Lỗi khi lọc thuốc: " + ex.Message);
            }
        }
    }
}
