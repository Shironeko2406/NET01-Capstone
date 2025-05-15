namespace ClinictManagementSystem.Enums
{
    public enum MedicineStockHistoryTypeEnum
    {
        Import,     // Nhập kho: nhập thêm thuốc từ nhà cung cấp
        Export,     // Xuất kho: khi bác sĩ kê đơn, thuốc được trừ kho
        Adjust      // Điều chỉnh kho: khi kiểm kê, sửa lại số lượng thực tế
    }
}
