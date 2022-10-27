using DevCamp_B2C_API_Connectors.Models;
using Microsoft.AspNetCore.Mvc;
using SendGrid.Helpers.Mail;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevCamp_B2C_API_Connectors.Services {

  class MailManager {

    public static bool SendWelcomeEmail(string email, string firstName) {

      var apiKey = Environment.GetEnvironmentVariable("SendGridApiKey");
      var templateId = Environment.GetEnvironmentVariable("WelcomeMessageTemplateId");

      var client = new SendGridClient(apiKey);

      var message = new SendGridMessage();

      message.From = new EmailAddress("ottobotman@powerbidevcamp.net", "Power BI Dev Camp");
      message.AddTo(new EmailAddress(email));

      message.TemplateId = templateId;      
      message.SetTemplateData(new {FirstName = firstName});

      var response = client.SendEmailAsync(message).Result;
      
      return response.IsSuccessStatusCode;

    }

  }

}
