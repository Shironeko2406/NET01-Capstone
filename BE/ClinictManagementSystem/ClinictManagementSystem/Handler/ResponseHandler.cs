using ClinictManagementSystem.Commons;

namespace ClinictManagementSystem.Handler
{
    public class ResponseHandler
    {
        public static ApiResponse<T> Success<T>(T data, string message = "Successful!")
        {
            return new ApiResponse<T>
            {
                Data = data,
                isSuccess = true,
                Message = message,
            };
        }

        public static ApiResponse<T> Failure<T>(string message)
        {
            return new ApiResponse<T>
            {
                Data = default(T),
                isSuccess = false,
                Message = message,

            };
        }

        public static ApiResponse<T> LogicFailure<T>(string message)
        {
            return new ApiResponse<T>
            {
                Data = default(T),
                isSuccess = true,
                Message = message
            };
        }
    }
}
