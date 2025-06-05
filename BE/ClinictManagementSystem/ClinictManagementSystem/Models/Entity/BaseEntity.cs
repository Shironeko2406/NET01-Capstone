using System.ComponentModel.DataAnnotations;

namespace ClinictManagementSystem.Models.Entity
{
    public abstract class BaseEntity
    {
        public bool IsDeleted { get; set; }
        public DateTime CreationDate { get; set; }
        public Guid? CreatedBy { get; set; }
    }
}
