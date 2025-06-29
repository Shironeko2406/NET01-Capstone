using ClinictManagementSystem.Models.DTO.StatisticDTO;
using ClinictManagementSystem.Models.Entity;
using ClinictManagementSystem.Repositories.Generic;

namespace ClinictManagementSystem.Repositories.PrescriptionDetailsRepo
{
    public interface IPrescriptionDetailsRepository : IGenericRepository<PrescriptionDetails>
    {
        Task<int> GetTotalMedicinesSold(DateTime start, DateTime end);
        Task<int> GetTotalMedicineRevenueByAppointmentIdsAsync(List<Guid> appointmentIds);
        Task<int> GetTotalMedicineRevenueAsync();
        Task<List<TopMedicineSoldDTO>> GetTopMedicinesSoldAsync(int top = 5);
    }
}
