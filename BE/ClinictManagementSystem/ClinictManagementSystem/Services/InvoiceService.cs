using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IUnitOfWork _unitOfWork;

        public InvoiceService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<int> CalculateInvoiceTotalAsync(Guid appointmentId)
        {
            try
            {
                const int baseConsultationFee = 350000;

                var appointment = await _unitOfWork.AppoinmentRepository.GetAppointmentWithDetailsForInvoiceAsync(appointmentId);

                if (appointment == null)
                    throw new Exception("Không tìm thấy lịch hẹn.");

                int serviceTotal = appointment.AppointmentServices
                    .Where(x => !x.IsDeleted && x.Service != null)
                    .Sum(x => x.Service.Price);

                int medicineTotal = 0;
                if (appointment.Prescription != null)
                {
                    medicineTotal = appointment.Prescription.PrescriptionDetails
                        .Where(x => !x.IsDeleted && x.Medicine != null)
                        .Sum(x => x.Medicine.Price * x.Quantity);
                }

                return baseConsultationFee + serviceTotal + medicineTotal;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi khi tính tổng hoá đơn: {ex.Message}");
            }
        }





        public async Task<bool> UpdatePaymentStatusAsync(Guid invoiceId, PaymentStatusEnum newStatus)
        {
            var invoice = await _unitOfWork.InvoiceRepository.GetByIdAsync(invoiceId);
            if (invoice == null) return false;

            invoice.PaymentStatus = newStatus;
            await _unitOfWork.SaveChangeAsync();

            return true;
        }
    }
}
