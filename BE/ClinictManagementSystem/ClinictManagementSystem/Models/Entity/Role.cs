using ClinictManagementSystem.Enums;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class Role
    {
        [Key]
        public Guid RoleId { get; set; }
        public string RoleName { get; set; }
        public ICollection<UserRole> UserRoles { get; set; }

    }
}
