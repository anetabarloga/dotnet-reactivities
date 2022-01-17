using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration config;

        public EmailSender(IConfiguration config)
        {
            this.config = config;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string msg)
        {
            var client = new SendGridClient(config["Sendgrid:Key"]);
            var message = new SendGridMessage
            {
                From = new EmailAddress("anetabarloga.dev@gmail.com", config["Sendgrid:User"]),
                Subject = emailSubject,
                PlainTextContent = msg,
                HtmlContent = msg

            };

            message.AddTo(new EmailAddress(userEmail));
            await client.SendEmailAsync(message);
        }
    }
}