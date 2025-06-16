using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.PrescriptionDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class PrescriptionService : IPrescriptionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMedicineService _medicineService;
        public PrescriptionService(IUnitOfWork unitOfWork, IMedicineService medicineService)
        {
            _unitOfWork = unitOfWork;
            _medicineService = medicineService;
        }
        public async Task<ApiResponse<bool>> CreatePrescriptionAsync(CreatePrescriptionDTO createPrescriptionDTO)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var appointment = await _unitOfWork.AppoinmentRepository.GetByIdAsync(createPrescriptionDTO.AppointmentId);
                if (appointment == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ResponseHandler.Failure<bool>("Không tìm thấy lịch hẹn.");
                }

                var prescription = new Prescription
                {
                    AppointmentId = createPrescriptionDTO.AppointmentId,
                    DoctorId = createPrescriptionDTO.DoctorId,
                    Notes = createPrescriptionDTO.Notes
                };

                var prescriptionDetails = new List<PrescriptionDetails>();

                foreach (var med in createPrescriptionDTO.Medicines)
                {
                    var updateSuccess = await _medicineService.UpdateReservedQuantityAsync(med.MedicineId, med.Quantity);
                    if (!updateSuccess)
                    {
                        await _unitOfWork.RollbackAsync();
                        return ResponseHandler.Failure<bool>($"Không thể cập nhật tồn kho cho thuốc ID: {med.MedicineId}");
                    }

                    prescriptionDetails.Add(new PrescriptionDetails
                    {
                        Prescription = prescription,
                        MedicineId = med.MedicineId,
                        Quantity = med.Quantity,
                        DosageInstructions = med.DosageInstructions
                    });
                }

                await _unitOfWork.PrescriptionRepository.AddAsync(prescription);
                await _unitOfWork.PrescriptionDetailsRepository.AddRangeAsync(prescriptionDetails);
                await _unitOfWork.SaveChangeAsync();

                await _unitOfWork.CommitAsync(); // Mọi thao tác thành công → commit

                return ResponseHandler.Success(true, "Tạo đơn thuốc thành công.");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync(); // Có exception → rollback

                return ResponseHandler.Failure<bool>($"Lỗi tạo đơn thuốc: {ex.Message}");
            }
        }
        public async Task<ApiResponse<bool>> UpdatePrescriptionAppointmentIdAsync(Guid appointmentId, UpdatePrescriptionDTO updatePrescriptionDTO)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var prescription = await _unitOfWork.PrescriptionRepository.FindSingleAsync(x => x.AppointmentId == appointmentId && !x.IsDeleted);

                if (prescription == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ResponseHandler.Failure<bool>("Không tìm thấy đơn thuốc cho lịch khám này.");
                }

                // Cập nhật ghi chú nếu có
                if (!string.IsNullOrWhiteSpace(updatePrescriptionDTO.Notes))
                {
                    prescription.Notes = updatePrescriptionDTO.Notes;
                }

                // Lấy chi tiết cũ và hoàn trả số lượng đã giữ (không cần kiểm kho)
                var oldDetails = await _unitOfWork.PrescriptionDetailsRepository.FindAsync(x => x.PrescriptionId == prescription.PrescriptionId);

                foreach (var old in oldDetails)
                {
                    var result = await _medicineService.UpdateReservedQuantityAsync(old.MedicineId, -old.Quantity, ignoreStockCheck: true);
                    if (!result)
                    {
                        await _unitOfWork.RollbackAsync();
                        return ResponseHandler.Failure<bool>($"Không thể hoàn trả tồn kho thuốc ID: {old.MedicineId}");
                    }
                }

                // Xoá chi tiết cũ
                _unitOfWork.PrescriptionDetailsRepository.HardRemoveRange(oldDetails.ToList());

                // Tạo chi tiết mới
                var newDetails = new List<PrescriptionDetails>();

                foreach (var med in updatePrescriptionDTO.Medicines)
                {
                    var result = await _medicineService.UpdateReservedQuantityAsync(med.MedicineId, med.Quantity);
                    if (!result)
                    {
                        await _unitOfWork.RollbackAsync();
                        return ResponseHandler.Failure<bool>($"Không đủ tồn kho cho thuốc ID: {med.MedicineId}");
                    }

                    newDetails.Add(new PrescriptionDetails
                    {
                        PrescriptionId = prescription.PrescriptionId,
                        MedicineId = med.MedicineId,
                        Quantity = med.Quantity,
                        DosageInstructions = med.DosageInstructions
                    });
                }

                await _unitOfWork.PrescriptionDetailsRepository.AddRangeAsync(newDetails);
                await _unitOfWork.SaveChangeAsync();

                await _unitOfWork.CommitAsync();
                return ResponseHandler.Success(true, "Cập nhật đơn thuốc thành công.");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi khi cập nhật đơn thuốc: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteMedicineInPrescriptionDetailAsync(Guid id)
        {
            await _unitOfWork.BeginTransactionAsync();

            try
            {
                var detail = await _unitOfWork.PrescriptionDetailsRepository.GetByIdAsync(id);
                if (detail == null)
                {
                    await _unitOfWork.RollbackAsync();
                    return ResponseHandler.Failure<bool>("Không tìm thấy chi tiết đơn thuốc.");
                }

                // Trả lại số lượng đã giữ
                var success = await _medicineService.UpdateReservedQuantityAsync(detail.MedicineId, -detail.Quantity, ignoreStockCheck: true);
                if (!success)
                {
                    await _unitOfWork.RollbackAsync();
                    return ResponseHandler.Failure<bool>("Không thể hoàn trả tồn kho thuốc.");
                }

                // Xoá chi tiết
                _unitOfWork.PrescriptionDetailsRepository.DeleteAsync(id);
                await _unitOfWork.SaveChangeAsync();

                await _unitOfWork.CommitAsync();
                return ResponseHandler.Success(true, "Xoá thuốc khỏi đơn thuốc thành công.");
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackAsync();
                return ResponseHandler.Failure<bool>($"Lỗi khi xoá thuốc khỏi đơn thuốc: {ex.Message}");
            }
        }

    }
}
