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
        public PrescriptionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreatePrescriptionAsync(CreatePrescriptionDTO createPrescriptionDTO)
        {
            try
            {
                var appointment = await _unitOfWork.AppoinmentRepository.GetByIdAsync(createPrescriptionDTO.AppointmentId);
                if (appointment == null)
                    return ResponseHandler.Failure<bool>("Appointment not found.");

                // Tạo đơn thuốc
                var prescription = new Prescription
                {
                    AppointmentId = createPrescriptionDTO.AppointmentId,
                    DoctorId = createPrescriptionDTO.DoctorId,
                    Notes = createPrescriptionDTO.Notes
                };

                await _unitOfWork.PrescriptionRepository.AddAsync(prescription);
                await _unitOfWork.SaveChangeAsync();

                // Tạo danh sách chi tiết đơn thuốc
                var prescriptionDetails = createPrescriptionDTO.Medicines.Select(med => new PrescriptionDetails
                {
                    PrescriptionId = prescription.PrescriptionId,
                    MedicineId = med.MedicineId,
                    Quantity = med.Quantity,
                    DosageInstructions = med.DosageInstructions
                }).ToList();

                await _unitOfWork.PrescriptionDetailsRepository.AddRangeAsync(prescriptionDetails);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Prescription created successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred while creating the prescription: {ex.Message}");
            }

        }
    }
}
