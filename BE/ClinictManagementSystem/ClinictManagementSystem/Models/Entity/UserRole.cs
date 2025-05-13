using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public class UserRole
    {
        [ForeignKey("User")]
        public Guid UserId { get; set; }

        [ForeignKey("Role")]
        public Guid RoleId { get; set; }

        public Users User { get; set; }
        public Role Role { get; set; }
    }
}
