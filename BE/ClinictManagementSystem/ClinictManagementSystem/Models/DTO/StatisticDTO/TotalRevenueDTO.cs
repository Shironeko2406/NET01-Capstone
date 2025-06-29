namespace ClinictManagementSystem.Models.DTO.StatisticDTO
{
    public class TotalRevenueDTO
    {
        // Tổng doanh thu trong tháng hiện tại
        public int TotalRevenue { get; set; }

        // Tổng số lượt khám bệnh trong tháng
        public int TotalAppointments { get; set; }

        // Doanh thu trung bình trên mỗi lượt khám
        public double AverageRevenuePerAppointment { get; set; }

        // Tổng số lượng thuốc đã bán
        public int TotalMedicinesSold { get; set; }

        // Dữ liệu biểu đồ: Doanh thu 6 tháng gần nhất
        public List<MonthlyRevenueData> Last6MonthsRevenue { get; set; }

        // Dữ liệu biểu đồ: Phân tích doanh thu theo nguồn (dịch vụ, thuốc, phí khám)
        public List<RevenueSourceAnalysis> RevenueBySource { get; set; }

        // Danh sách top 5 dịch vụ xét nghiệm có doanh thu cao nhất
        public List<TopServiceRevenue> TopServiceRevenues { get; set; }

        // Danh sách top 5 thuốc bán chạy nhất
        public List<TopMedicineSold> TopMedicinesSold { get; set; }
    }

    public class MonthlyRevenueData
    {
        public string Month { get; set; } 
        public int Total { get; set; }
        public int Appointments { get; set; }
        public int Medicine { get; set; }
        public int Tests { get; set; }
    }

    public class RevenueSourceAnalysis
    {
        public string Name { get; set; }   // "Phí khám bệnh", "Thuốc", "Xét nghiệm"
        public int Value { get; set; }     // Tổng doanh thu từ nguồn này
    }

    public class TopServiceRevenue
    {
        public string ServiceName { get; set; }       // Tên dịch vụ, VD: "Xét nghiệm máu"
        public int Revenue { get; set; }          // Tổng doanh thu từ dịch vụ
        public int AppointmentCount { get; set; }     // Số lượt khám có dịch vụ này
    }

    public class TopMedicineSold
    {
        public string MedicineName { get; set; }  // Tên thuốc, VD: "Paracetamol 500mg"
        public int Revenue { get; set; }      // Doanh thu từ thuốc
        public int Quantity { get; set; }     // Số lượng thuốc đã bán
    }
}
