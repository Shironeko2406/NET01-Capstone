using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.MedicineDTO
{
    public class FilterMedicineDTO
    {
        public string? Search { get; set; }
        public Guid? MedicineTypeId { get; set; }
        public MedicineStatusEnum? Status { get; set; }
        public SortEnum? SortBy { get; set; }
        public SortFieldMedicineEnum? SortField { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
