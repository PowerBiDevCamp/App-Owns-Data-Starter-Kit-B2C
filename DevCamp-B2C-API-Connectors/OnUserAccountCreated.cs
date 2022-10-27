using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SendGrid;
using SendGrid.Helpers.Mail;

using DevCamp_B2C_API_Connectors.Models;
using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;
using DevCamp_B2C_API_Connectors.Services;

namespace DevCamp_B2C_API_Connectors {

  public class OnUserAccountCreated {

    private readonly AppOwnsDataDBService appOwnsDataDBService;

    public OnUserAccountCreated(AppOwnsDataDBService appOwnsDataDBService) {
      this.appOwnsDataDBService = appOwnsDataDBService;
    }

    [FunctionName("OnUserAccountCreated")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req, ILogger log) {

      log.LogInformation("API Connection for OnUserAccountCreated executing...");

      string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

      log.LogInformation("Request Body: " + requestBody);

      dynamic data = JsonConvert.DeserializeObject(requestBody);

      if (data != null && data.email != null && data.givenName != null && data.displayName != null) {

        string email = data.email;
        string firstName = data.givenName;
        string displayName = data.displayName;
        string defaultTenant = "Demo Tenant";

        if (this.appOwnsDataDBService.GetUser(email) == null) {

          var user = this.appOwnsDataDBService.CreateUser(new User {
            LoginId = email,
            UserName = displayName,
            TenantName = defaultTenant,
            CanEdit = false,
            CanCreate = false,
            TenantAdmin = false
          });

          this.appOwnsDataDBService.PostActivityLogEntry(new ActivityLogEntry {
            Activity = "CreateAccount",
            LoginId = user.LoginId,
            User = user.UserName,
            Tenant = defaultTenant
          });

          log.LogInformation("Adding new user: " + email);

          bool mailSentSuccessfully = MailManager.SendWelcomeEmail(email, firstName);

          if (mailSentSuccessfully) {
            log.LogInformation("Welcome message sent to " + displayName + " at " + email);
          }
          else {
            log.LogInformation("Welcome message could not be sent to " + displayName + " at " + email);
          }

          return (ActionResult)new OkObjectResult(new ResponseContent("Continue", "New user has been created."));
        }
        else {
          log.LogInformation("User already existed: " + email);
          return (ActionResult)new OkObjectResult(new ResponseContent("Continue", "This user was previously creted."));
        }
      }
      else {
        log.LogInformation("ValidationError: Request must include email, givenName and displayName in post body");
        return (ActionResult)new BadRequestObjectResult(new ResponseContent("ValidationError", "Request must include email, givenName and displayName in post body."));
      }
    }
  }
}
