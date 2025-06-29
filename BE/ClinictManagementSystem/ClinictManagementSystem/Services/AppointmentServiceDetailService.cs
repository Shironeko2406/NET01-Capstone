using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.AppointmentServicesDTO;
using ClinictManagementSystem.Models.DTO.TestResultDTO;
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
                var existingService = await _unitOfWork.AppointmentServicesRepository.FindSingleAsync(x => x.Id == id && !x.IsDeleted);

                if (existingService == null)
                {
                    return ResponseHandler.Failure<bool>("Không tìm thấy dịch vụ khám.");
                }

                if (existingService.IsCompleted != AppointmentServiceStatusEnum.Assigned)
                {
                    return ResponseHandler.Failure<bool>("Chỉ được phép cập nhật các dịch vụ đang ở trạng thái 'Đã chỉ định'.");
                }

                if (!string.IsNullOrWhiteSpace(appointmentServiceUpdateDTO.Note))
                {
                    existingService.Note = appointmentServiceUpdateDTO.Note;
                }

                await _unitOfWork.AppointmentServicesRepository.UpdateAsync(existingService);
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Cập nhật dịch vụ khám thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }


        public async Task<ApiResponse<bool>> UpdateAppointmentServiceStatusAsync(Guid id, AppointmentServiceStatusEnum appointmentServiceStatusEnum)
        {
            try
            {
                var appointmentService = await _unitOfWork.AppointmentServicesRepository.GetByIdAsync(id);
                if (appointmentService == null)
                    return ResponseHandler.Failure<bool>("Không tìm thấy dịch vụ xét nghiệm.");

                var currentStatus = appointmentService.IsCompleted;

                switch (currentStatus)
                {
                    case AppointmentServiceStatusEnum.Assigned:
                        if (appointmentServiceStatusEnum != AppointmentServiceStatusEnum.InProgress && appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Cancelled)
                            return ResponseHandler.Failure<bool>("Trạng thái 'Đã chỉ định' chỉ có thể cập nhật thành 'Đang thực hiện' hoặc 'Đã huỷ'.");
                        break;

                    case AppointmentServiceStatusEnum.InProgress:
                        if (appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Completed && appointmentServiceStatusEnum != AppointmentServiceStatusEnum.Cancelled)
                            return ResponseHandler.Failure<bool>("Trạng thái 'Đang thực hiện' chỉ có thể cập nhật thành 'Hoàn thành' hoặc 'Đã huỷ'.");
                        break;

                    case AppointmentServiceStatusEnum.Completed:
                        return ResponseHandler.Failure<bool>("Không thể thay đổi trạng thái của dịch vụ đã hoàn thành.");

                    case AppointmentServiceStatusEnum.Cancelled:
                        return ResponseHandler.Failure<bool>("Không thể thay đổi trạng thái của dịch vụ đã huỷ.");
                }
                // Kiểm tra nếu chuyển sang Completed thì phải có TestResult.Result
                if (appointmentServiceStatusEnum == AppointmentServiceStatusEnum.Completed)
                {
                    var testResult = await _unitOfWork.TestResultRepository.FindSingleAsync(tr => tr.AppointmentServiceId == appointmentService.Id);

                    if (testResult == null || string.IsNullOrWhiteSpace(testResult.Result))
                    {
                        return ResponseHandler.Failure<bool>("Không thể chuyển sang trạng thái 'Hoàn thành' vì kết quả xét nghiệm còn thiếu hoặc rỗng.");
                    }
                }

                if (currentStatus == AppointmentServiceStatusEnum.Assigned && appointmentServiceStatusEnum == AppointmentServiceStatusEnum.InProgress)
                {
                    // Kiểm tra nếu đã tồn tại TestResult thì không tạo nữa
                    var existingTestResult = await _unitOfWork.TestResultRepository.FindSingleAsync(tr => tr.AppointmentServiceId == appointmentService.Id);

                    if (existingTestResult == null)
                    {
                        var newTestResult = new TestResult
                        {
                            AppointmentServiceId = appointmentService.Id
                        };

                        await _unitOfWork.TestResultRepository.AddAsync(newTestResult);
                    }
                }

                appointmentService.IsCompleted = appointmentServiceStatusEnum;
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, $"Cập nhật trạng thái dịch vụ xét nghiệm thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
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
                    Status = s.IsCompleted,
                    TestResult = s.TestResult != null ? new GetTestResultDTO
                    {
                        TestResultId = s.TestResult.TestResultId,
                        Result = s.TestResult.Result,
                        ResultDate = s.TestResult.ResultDate,
                        CreatedBy = s.TestResult.UpdatedByUser?.Username
                    } : null
                }).ToList();


                return ResponseHandler.Success(result, "Retrieved appointment services successfully.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<AppointmentServiceResponseDTO>>($"An error occurred: {ex.Message}");
            }
        }

        public async Task<ApiResponse<bool>> DeleteAppointmentServiceByIdAsync(Guid id)
        {
            try
            {
                var appointmentService = await _unitOfWork.AppointmentServicesRepository.FindSingleAsync(x => x.Id == id && !x.IsDeleted);

                if (appointmentService == null)
                {
                    return ResponseHandler.Failure<bool>("Không tìm thấy dịch vụ khám.");
                }

                appointmentService.IsDeleted = true;
                await _unitOfWork.SaveChangeAsync();

                return ResponseHandler.Success(true, "Xóa dịch vụ khám thành công.");
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<bool>($"Đã xảy ra lỗi: {ex.Message}");
            }
        }

    }
}
