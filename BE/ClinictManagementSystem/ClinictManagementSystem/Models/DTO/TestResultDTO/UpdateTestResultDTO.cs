using System.ComponentModel.DataAnnotations.Schema;

namespace ClinictManagementSystem.Models.DTO.TestResultDTO
{
    public class UpdateTestResultDTO
    {
        public string Result { get; set; }
        public DateTime ResultDate { get; set; }
    }
}
