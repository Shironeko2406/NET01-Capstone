using ClinictManagementSystem.Models.DTO.EmailDTO;

namespace ClinictManagementSystem.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailRegisterUserAsync(string toEmail, string fullName, string username, string password);
    }
}
