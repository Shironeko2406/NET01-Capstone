using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using ClinictManagementSystem.Enums;

namespace ClinictManagementSystem.Models.Entity
{
    public class Invoice
    {
        [Key]
        public Guid InvoiceId { get; set; }

        public Guid AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

        public int TotalAmount { get; set; }
        public PaymentStatusEnum PaymentStatus { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
