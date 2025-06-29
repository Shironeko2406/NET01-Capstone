using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;
        private readonly IMedicineStockHistoryService _medicineStockHistoryService;

        public InvoiceService(IUnitOfWork unitOfWork, ICurrentTime currentTime, IMedicineStockHistoryService medicineStockHistoryService)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
            _medicineStockHistoryService = medicineStockHistoryService;
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

        //public async Task<bool> UpdatePaymentStatusAsync(Guid invoiceId, PaymentStatusEnum newStatus)
        //{
        //    var invoice = await _unitOfWork.InvoiceRepository.GetByIdAsync(invoiceId);
        //    if (invoice == null) return false;

        //    invoice.PaymentStatus = newStatus;
        //    await _unitOfWork.SaveChangeAsync();

        //    return true;
        //}
        public async Task<bool> UpdatePaymentStatusAsync(Guid invoiceId, PaymentStatusEnum newStatus)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var invoice = await _unitOfWork.InvoiceRepository.GetDetailInvoiceIdAsync(invoiceId);
                if (invoice == null)
                    throw new Exception("Không tìm thấy hóa đơn.");

                if (invoice.PaymentStatus == PaymentStatusEnum.Paid)
                    throw new Exception("Hóa đơn đã được thanh toán trước đó.");

                // Cập nhật trạng thái hóa đơn
                invoice.PaymentStatus = newStatus;
                invoice.PaymentDate = _currentTime.GetCurrentTime();

                // Kiểm tra thông tin liên quan
                var appointment = invoice.Appointment;
                var prescription = appointment?.Prescription;

                if (appointment == null || prescription == null)
                    throw new Exception("Thiếu thông tin lịch hẹn hoặc đơn thuốc.");

                // Cập nhật trạng thái lịch hẹn
                appointment.Status = AppointmentStatusEnum.Completed;

                var stockHistories = new List<MedicineStockHistory>();

                foreach (var detail in prescription.PrescriptionDetails)
                {
                    var medicine = detail.Medicine;
                    if (medicine == null)
                        throw new Exception("Không tìm thấy thông tin thuốc.");

                    if (medicine.StockQuantity < detail.Quantity)
                        throw new Exception($"Thuốc '{medicine.Name}' không đủ tồn kho.");

                    // Trừ kho
                    medicine.StockQuantity -= detail.Quantity;
                    medicine.ReservedQuantity = Math.Max(medicine.ReservedQuantity - detail.Quantity, 0);

                    // Lịch sử xuất kho
                    stockHistories.Add(new MedicineStockHistory
                    {
                        MedicineId = medicine.MedicineId,
                        Quantity = -detail.Quantity,
                        Type = MedicineStockHistoryTypeEnum.Export,
                        CreatedBy = appointment.PatientId,
                        TransactionCode = await _medicineStockHistoryService.GenerateTransactionCodeAsync(),
                        Note = $"Xuất cho đơn thuốc của lịch khám [{appointment.AppointmentCode}]"
                    });
                }

                // Thêm toàn bộ lịch sử xuất kho
                await _unitOfWork.MedicineStockHistoryRepository.AddRangeMedicineStockHistoryAsync(stockHistories);

                await _unitOfWork.SaveChangeAsync();
                await _unitOfWork.CommitAsync();

                return true;
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return false;
            }
        }


    }
}
