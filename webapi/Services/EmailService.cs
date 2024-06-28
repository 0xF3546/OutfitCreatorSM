using System.Net.Mail;
using System.Net;

namespace webapi.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string smtpServer = "smtp.provider.com";
        private readonly int smtpPort = 587;
        private readonly string from = "mail@github.com";

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendAsync(string to, string subject, string body)
        {
            await SendEmailAsync(to, subject, body);
        }

        private Task SendEmailAsync(string to, string subject, string body)
        {
            MailMessage mailMessage = new()
            {
                Subject = subject,
                IsBodyHtml = true,
                Body = $"<!DOCTYPE html>\r\n<html>\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title>Username</title>\r\n</head>\r\n<body style=\"font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0; word-wrap: break-word;\">\r\n    <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\r\n        <tr>\r\n            <td style=\"text-align: center; background-color: #007bff; padding: 20px;\">\r\n                <h1 style=\"color: #fff; margin: 0;\">{subject}</h1>\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n            <td style=\"background-color: #fff; padding: 20px;\">\r\n                <p style=\"font-size: 16px; color: #333; text-align:center;\">{body}</p>\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n            <td style=\"text-align:center; background-color: #f8f6f0;padding: 20px;\"><img src=\"LOGO\" style=\"max-width: 20vh;\"></td>\r\n        </tr>\r\n    </table>\r\n</body>\r\n</html>\r\n"
            };
            mailMessage.To.Add(to);
            mailMessage.From = new MailAddress(from);

            SmtpClient client = new(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(_configuration.GetSection("SmtpSettings:SmtpUsername").Value, _configuration.GetSection("SmtpSettings:SmtpPassword").Value),
                EnableSsl = true
            };

            try
            {
                client.Send(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            return Task.CompletedTask;
        }
    }

    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }
}
