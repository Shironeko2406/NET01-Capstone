namespace ClinictManagementSystem.Models.DTO.TestResultDTO
{
    public class GetTestResultDTO
    {
        public Guid TestResultId { get; set; }
        public string? Result { get; set; }
        public DateTime? ResultDate { get; set; }
        public string? CreatedBy { get; set; }

    }
}
