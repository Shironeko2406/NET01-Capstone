using ClinictManagementSystem.Helper;
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

        public async Task<bool> SendEmailRegisterAndAppointmentAsync(RegisterAndAppointmentEmailDTO registerAndAppointmentEmailDTO)
        {
            try
            {
                var emailSettings = _configuration.GetSection("EmailSettings");

                var formattedDate = DateTimeFormatterHelper.ToVietnameseDayOfWeek(registerAndAppointmentEmailDTO.AppointmentDate);
                var formattedStartTime = registerAndAppointmentEmailDTO.StartTime.ToString(@"hh\:mm");
                var formattedEndTime = registerAndAppointmentEmailDTO.EndTime.ToString(@"hh\:mm");

                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"]));
                email.To.Add(new MailboxAddress("", registerAndAppointmentEmailDTO.ToEmail));
                email.Subject = "Thông tin tài khoản & lịch hẹn khám bệnh";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <div style='font-family: ""Helvetica Neue"", Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f7fa; border-radius: 12px;'>
                            <div style='background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);'>
                                <!-- Header -->
                                <div style='text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e0e4e8;'>
                                    <h1 style='color: #1a73e8; font-size: 24px; margin: 0;'>Chào mừng {registerAndAppointmentEmailDTO.FullName}</h1>
                                    <p style='color: #4a5568; font-size: 16px; margin: 10px 0 0;'>Cảm ơn bạn đã đăng ký và đặt lịch hẹn tại phòng khám của chúng tôi!</p>
                                </div>

                                <!-- Account Information -->
                                <div style='margin: 30px 0;'>
                                    <h2 style='color: #2d3748; font-size: 20px; margin-bottom: 15px;'>🔐 Thông tin tài khoản</h2>
                                    <table style='width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden;'>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e0e4e8;'>Tên đăng nhập</td>
                                            <td style='padding: 12px; color: #4a5568;'>{registerAndAppointmentEmailDTO.Username}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748;'>Mật khẩu</td>
                                            <td style='padding: 12px; color: #4a5568;'>{registerAndAppointmentEmailDTO.Password}</td>
                                        </tr>
                                    </table>
                                    <p style='color: #e53e3e; font-size: 14px; margin-top: 10px;'>💡 Vui lòng đăng nhập và đổi mật khẩu ngay để bảo mật tài khoản của bạn.</p>
                                </div>

                                <!-- Appointment Information -->
                                <div style='margin: 30px 0;'>
                                    <h2 style='color: #2d3748; font-size: 20px; margin-bottom: 15px;'>📅 Thông tin lịch hẹn</h2>
                                    <table style='width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; overflow: hidden;'>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e0e4e8;'>Mã tra cứu</td>
                                            <td style='padding: 12px; color: #4a5568;'>{registerAndAppointmentEmailDTO.AppointmentCode}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e0e4e8;'>Bác sĩ</td>
                                            <td style='padding: 12px; color: #4a5568;'>{registerAndAppointmentEmailDTO.DoctorName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e0e4e8;'>Chuyên khoa</td>
                                            <td style='padding: 12px; color: #4a5568;'>{registerAndAppointmentEmailDTO.SpecialtyName}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748; border-bottom: 1px solid #e0e4e8;'>Ngày khám</td>
                                            <td style='padding: 12px; color: #4a5568;'>{formattedDate}</td>
                                        </tr>
                                        <tr>
                                            <td style='padding: 12px; font-weight: bold; color: #2d3748;'>Giờ khám</td>
                                            <td style='padding: 12px; color: #4a5568;'>{formattedStartTime} - {formattedEndTime}</td>
                                        </tr>
                                    </table>
                                </div>

                                <!-- Reminder -->
                                <div style='text-align: center; padding: 20px; background-color: #e6fffa; border-radius: 8px; margin-top: 20px;'>
                                    <p style='color: #2b6cb0; font-size: 16px; margin: 0;'>🕒 Vui lòng đến trước <strong>15 phút</strong> để làm thủ tục tiếp nhận.</p>
                                </div>

                                <!-- Footer -->
                                <div style='text-align: center; padding-top: 20px; border-top: 1px solid #e0e4e8; margin-top: 30px;'>
                                    <p style='color: #4a5568; font-size: 14px; margin: 0;'>Trân trọng,</p>
                                    <p style='color: #2d3748; font-size: 16px; font-weight: bold; margin: 5px 0;'>Phòng Tiếp Tân - Phòng Khám</p>
                                    <p style='color: #718096; font-size: 12px; margin-top: 10px;'>Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>
                                </div>
                            </div>
                        </div>"
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
