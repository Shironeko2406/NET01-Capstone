namespace ClinictManagementSystem.Enums
{
    public enum AppointmentStatusEnum
    {
        Booked,        // Đã đặt lịch
        Waiting,       // Đang chờ khám
        InProgress,    // Đang khám
        PendingPayment,  // Đang chờ thanh toán
        Completed,     // Đã khám xong
        Cancelled      // Hủy lịch
    }
}
