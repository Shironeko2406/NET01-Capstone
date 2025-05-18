using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.DTO.UsersDTO
{
    public class FilterUsersDTO
    {
        public string? Search { get; set; }
        public RoleEnum? Role { get; set; }
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
