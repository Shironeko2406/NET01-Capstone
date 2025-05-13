namespace ClinictManagementSystem.Commons
{
    public class ApiResponse<T>
    {
        public T? Data { get; set; }
        public bool isSuccess { get; set; } = true;
        public string? Message { get; set; }
    }
}
