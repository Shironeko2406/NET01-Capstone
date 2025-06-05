using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.MedicineHistoryStockDTO
{
    public class MedicineStockHistoryFilterDTO
    {
        public string? Search {  get; set; } //Tra cứu tích hợp mã Trans và MED(nhiều trường)
        public SortEnum? SortBy { get; set; } //sort theo thời gian tăng giảm
        public MedicineStockHistoryTypeEnum? Type { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
