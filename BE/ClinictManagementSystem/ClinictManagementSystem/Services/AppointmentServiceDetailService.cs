using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class AppointmentServiceDetailService : IAppointmentServiceDetailService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AppointmentServiceDetailService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<ApiResponse<bool>> CreateAppoinmentServiceById(Guid appointmentId, AppointmentServiceCreateListDTO appointmentServiceCreateListDTO)
        {
            try
            {
                var appointment = await _unitOfWork.AppoinmentRepository.GetByIdAsync(appointmentId);
                if (appointment == null)
                {
                    return ResponseHandler.Failure<bool>("Appointment not found.");
                }

                // 2. Map DTO -> Entity
                var appointmentServices = appointmentServiceCreateListDTO.Services.Select(dto => new AppointmentServices
                {
                    AppointmentId = appointmentId,
                    ServiceId = dto.ServiceId,
                    Note = dto.Note,
                    IsCompleted = AppointmentServiceStatusEnum.Assigned,
                }).ToList();

                await _unitOfWork.AppointmentServicesRepository.AddRangeAsync(appointmentServices);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Appointment services created successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateAppointmentServiceById(Guid id, AppointmentServiceUpdateDTO appointmentServiceUpdateDTO)
        {
            try
            {
                var existingService = await _unitOfWork.AppointmentServicesRepository.GetByIdAsync(id);

                if (existingService == null)
                {
                    return ResponseHandler.Failure<bool>("Appointment service not found.");
                }

                if (existingService.IsCompleted != AppointmentServiceStatusEnum.Assigned)
                {
                    return ResponseHandler.Failure<bool>("Only services with status 'Assigned' can be updated.");
                }

                if (!string.IsNullOrWhiteSpace(appointmentServiceUpdateDTO.Note))
                {
                    existingService.Note = appointmentServiceUpdateDTO.Note;
                }

                await _unitOfWork.AppointmentServicesRepository.UpdateAsync(existingService);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Appointment service updated successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> UpdateAppointmentServiceStatusAsync(Guid id, AppointmentServiceStatusEnum appointmentServiceStatusEnum)
        {
            try
            {
                var appointmentService = await _unitOfWork.AppointmentServicesRepository.GetByIdAsync(id);
                if (appointmentService == null)
                    return ResponseHandler.Failure<bool>("Appointment service not found.");

                var currentStatus = appointmentService.IsCompleted;

                switch (currentStatus)
                {
                    case AppointmentServiceStatusEnum.Assigned:
                        if (appointmentServiceStatusEnum != AppointmentServiceStatusEnum.InProgress && appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Cancelled)
                            return ResponseHandler.Failure<bool>("Assigned service can only be updated to InProgress or Cancelled.");
                        break;

                    case AppointmentServiceStatusEnum.InProgress:
                        if (appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Completed && appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Cancelled)
                            return ResponseHandler.Failure<bool>("InProgress service can only be updated to Completed or Cancelled.");
                        break;

                    case AppointmentServiceStatusEnum.Completed:
                        return ResponseHandler.Failure<bool>("Completed service status cannot be changed.");

                    case AppointmentServiceStatusEnum.Cancelled:
                        return ResponseHandler.Failure<bool>("Cancelled service status cannot be changed.");
                }
                // Kiểm tra nếu chuyển sang Completed thì phải có TestResult.Result
                if (appointmentServiceStatusEnum == AppointmentServiceStatusEnum.Completed)
                {
                    var testResult = await _unitOfWork.TestResultRepository
                        .FindSingleAsync(tr => tr.AppointmentId == appointmentService.AppointmentId && tr.ServiceId == appointmentService.ServiceId);

                    if (testResult == null || string.IsNullOrWhiteSpace(testResult.Result))
                    {
                        return ResponseHandler.Failure<bool>("Cannot mark service as Completed because the test result is missing or empty.");
                    }
                }

                if (currentStatus == AppointmentServiceStatusEnum.Assigned && appointmentServiceStatusEnum == AppointmentServiceStatusEnum.InProgress)
                {
                    // Kiểm tra nếu đã tồn tại TestResult thì không tạo nữa
                    var existingTestResult = await _unitOfWork.TestResultRepository.FindSingleAsync(tr => tr.AppointmentId == appointmentService.AppointmentId && tr.ServiceId == appointmentService.ServiceId);

                    if (existingTestResult == null)
                    {
                        var testResult = new TestResult
                        {
                            AppointmentId = appointmentService.AppointmentId,
                            ServiceId = appointmentService.ServiceId,
                        };

                        await _unitOfWork.TestResultRepository.AddAsync(testResult);
                    }
                }

                appointmentService.IsCompleted = appointmentServiceStatusEnum;
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, $"Appointment service status updated to {appointmentServiceStatusEnum}.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<AppointmentServiceResponseDTO>>> GetAppointmentServicesByAppointmentIdAsync(Guid appointmentId)
        {
            try
            {
                var exists = await _unitOfWork.AppoinmentRepository.AnyAsync(x => x.AppointmentId == appointmentId && !x.IsDeleted);
                if (!exists)
                {
                    return ResponseHandler.Failure<List<AppointmentServiceResponseDTO>>("Appointment not found.");
                }

                var services = await _unitOfWork.AppointmentServicesRepository.GetByAppointmentIdWithServiceAsync(appointmentId);

                var result = services.Select(s => new AppointmentServiceResponseDTO
                {
                    Id = s.Id,
                    ServiceId = s.ServiceId,
                    ServiceName = s.Service.Name,
                    Note = s.Note,
                    Status = s.IsCompleted
                }).ToList();

                return ResponseHandler.Success(result, "Retrieved appointment services successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<AppointmentServiceResponseDTO>>($"An error occurred: {ex.Message}");
            }
        }



    }
}
