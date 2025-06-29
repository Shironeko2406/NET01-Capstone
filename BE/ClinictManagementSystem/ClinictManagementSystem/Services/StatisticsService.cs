using ClinictManagementSystem.Commons;
using ClinictManagementSystem.Enums;
using ClinictManagementSystem.Handler;
using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Repositories.UnitOfWork;

namespace ClinictManagementSystem.Services
{
    public class StatisticsService : IStatisticsService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICurrentTime _currentTime;

        public StatisticsService(IUnitOfWork unitOfWork, ICurrentTime currentTime)
        {
            _unitOfWork = unitOfWork;
            _currentTime = currentTime;
        }
        public async Task<ApiResponse<AppointmentStatisticsDTO>> GetAppoinmentStatistic()
        {
            try
            {
                var today = _currentTime.GetCurrentTime();
                var appointmentRepo = _unitOfWork.AppoinmentRepository;

                var booked = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Booked);
                var waiting = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Waiting);
                var inProgress = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.InProgress);
                var pendingPayment = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.PendingPayment);
                var completed = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Completed);
                var cancelled = await appointmentRepo.CountByStatusAsync(AppointmentStatusEnum.Cancelled);
                var todayCount = await appointmentRepo.CountTodayAsync(today);
                int total = await appointmentRepo.CountAsync();
                var patientCount = total - cancelled;
                double completionRate = total > 0 ? Math.Round((double)completed / total * 100, 2) : 0;
                var dto = new AppointmentStatisticsDTO
                {
                    Total = total,
                    BookedCount = booked,
                    WaitingCount = waiting,
                    InProgressCount = inProgress,
                    PendingPaymentCount = pendingPayment,
                    CompletedCount = completed,
                    CancelledCount = cancelled,
                    TodayCount = todayCount,
                    CompletionRate = completionRate,
                    PatientCount = patientCount
                };

                return ResponseHandler.Success(dto);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<AppointmentStatisticsDTO>($"Error: {ex.Message}");
            }
        }

        public async Task<ApiResponse<RevenueOverviewDTO>> GetRevenueOverview(FilterTimeTotalRevenueDTO filterTimeTotalRevenueDTO)
        {
            try
            {
                var paidInvoices = await _unitOfWork.InvoiceRepository.GetInvoicesByTimeRangeAsync(filterTimeTotalRevenueDTO.StartTime, filterTimeTotalRevenueDTO.EndTime);

                var totalRevenue = paidInvoices.Sum(invoice => invoice.TotalAmount);

                var totalAppointments = paidInvoices
                    .Select(invoice => invoice.AppointmentId)
                    .Distinct()
                    .Count();

                var averageRevenue = totalAppointments > 0
                    ? Math.Round((double)totalRevenue / totalAppointments)
                    : 0;

                var totalMedicinesSold = await _unitOfWork.PrescriptionDetailsRepository
                    .GetTotalMedicinesSold(filterTimeTotalRevenueDTO.StartTime, filterTimeTotalRevenueDTO.EndTime);

                var dto = new RevenueOverviewDTO
                {
                    TotalRevenue = totalRevenue,
                    TotalAppointments = totalAppointments,
                    AverageRevenuePerAppointment = averageRevenue,
                    TotalMedicinesSold = totalMedicinesSold
                };

                return ResponseHandler.Success(dto);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<RevenueOverviewDTO>($"Lỗi khi tính doanh thu: {ex.Message}");
            }
        }


        public async Task<ApiResponse<List<MonthlyRevenueDataDTO>>> GetMonthlyRevenueLast6Months()
        {
            try
            {
                var result = new List<MonthlyRevenueDataDTO>();
                var now = _currentTime.GetCurrentTime(); 
                var startMonth = now.AddMonths(-5); 
                var current = new DateTime(startMonth.Year, startMonth.Month, 1);

                for (int i = 0; i < 6; i++) 
                {
                    var monthStart = new DateTime(current.Year, current.Month, 1);
                    var monthEnd = monthStart.AddMonths(1).AddSeconds(-1);

                    var paidInvoices = await _unitOfWork.InvoiceRepository.GetInvoicesByTimeRangeAsync(monthStart, monthEnd);

                    var appointmentIds = paidInvoices
                        .Select(x => x.AppointmentId)
                        .Distinct()
                        .ToList();

                    var appointmentRevenue = await _unitOfWork.AppoinmentRepository.GetTotalAppointmentRevenueByIdsAsync(appointmentIds);

                    var medicineRevenue = await _unitOfWork.PrescriptionDetailsRepository.GetTotalMedicineRevenueByAppointmentIdsAsync(appointmentIds);

                    var testRevenue = await _unitOfWork.AppointmentServicesRepository.GetTotalTestRevenueByAppointmentIdsAsync(appointmentIds);

                    var total = appointmentRevenue + medicineRevenue + testRevenue;

                    result.Add(new MonthlyRevenueDataDTO
                    {
                        Month = monthStart.ToString("MM/yyyy"),
                        Total = total,
                        Appointments = appointmentRevenue,
                        Medicine = medicineRevenue,
                        Tests = testRevenue
                    });

                    current = current.AddMonths(1);
                }

                return ResponseHandler.Success(result);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<MonthlyRevenueDataDTO>>($"Lỗi khi lấy doanh thu 6 tháng: {ex.Message}");
            }
        }
        public async Task<ApiResponse<List<RevenueSourceAnalysisDTO>>> GetRevenueBySource()
        {
            try
            {
                var appointmentRevenue = await _unitOfWork.AppoinmentRepository.GetTotalAppointmentRevenueAsync();
                var medicineRevenue = await _unitOfWork.PrescriptionDetailsRepository.GetTotalMedicineRevenueAsync();
                var testRevenue = await _unitOfWork.AppointmentServicesRepository.GetTotalTestRevenueAsync();

                var result = new List<RevenueSourceAnalysisDTO>
                {
                    new RevenueSourceAnalysisDTO { Name = "Phí khám bệnh", Value = appointmentRevenue },
                    new RevenueSourceAnalysisDTO { Name = "Thuốc", Value = medicineRevenue },
                    new RevenueSourceAnalysisDTO { Name = "Xét nghiệm", Value = testRevenue }
                };

                return ResponseHandler.Success(result);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<RevenueSourceAnalysisDTO>>($"Lỗi khi lấy dữ liệu doanh thu theo nguồn: {ex.Message}");
            }
        }
        public async Task<ApiResponse<List<TopMedicineSoldDTO>>> GetTopMedicinesSold()
        {
            try
            {
                var result = await _unitOfWork.PrescriptionDetailsRepository.GetTopMedicinesSoldAsync();
                return ResponseHandler.Success(result);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<TopMedicineSoldDTO>>($"Lỗi khi lấy top thuốc bán chạy: {ex.Message}");
            }
        }

        public async Task<ApiResponse<List<TopServiceRevenueDTO>>> GetTopServiceRevenues()
        {
            try
            {
                var result = await _unitOfWork.AppointmentServicesRepository.GetTopServiceRevenuesAsync();
                return ResponseHandler.Success(result);
            }
            catch (Exception ex)
            {
                return ResponseHandler.Failure<List<TopServiceRevenueDTO>>($"Lỗi khi lấy top dịch vụ doanh thu cao: {ex.Message}");
            }
        }
    }
}
