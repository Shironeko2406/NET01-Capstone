using ClinictManagementSystem.Interfaces;
using ClinictManagementSystem.Models.DTO.EmailDTO;
using MailKit.Net.Smtp;
using MimeKit;


namespace ClinictManagementSystem.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<bool> SendEmailRegisterUserAsync(string toEmail, string fullName, string username, string password)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
                email.To.Add(new MailboxAddress("", toEmail));
                email.Subject = "Thông tin tài khoản đăng nhập hệ thống";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                <h3>Xin chào {fullName},</h3>
                <p>Tài khoản của bạn đã được tạo thành công.</p>
                <p><strong>Tên đăng nhập:</strong> {username}</p>
                <p><strong>Mật khẩu:</strong> {password}</p>
                <p>Vui lòng đăng nhập và đổi mật khẩu ngay khi có thể để bảo mật tài khoản.</p>
                <br/>
                <p>Trân trọng,<br/>Phòng Quản trị Hệ thống</p>"
                };

                email.Body = bodyBuilder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]), MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(emailSettings["SenderEmail"], emailSettings["Password"]);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi gửi mail: {ex.Message}");
                return false;
            }
        }
    }
}
