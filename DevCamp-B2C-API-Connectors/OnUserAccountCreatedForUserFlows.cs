using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using DevCamp_B2C_API_Connectors.Models;
using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;

namespace DevCamp_B2C_API_Connectors {
  public class OnUserAccountCreatedForUserFlows {  

    [FunctionName("OnUserAccountCreatedForUserFlows")]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "get", "post")] HttpRequest req, ILogger log) {

      log.LogInformation("API Connection for OnUserAccountCreatedForUserFlows executing...");

      string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

      log.LogInformation("Request Body: " + requestBody);

      return (ActionResult)new OkObjectResult(new ResponseContent("Continue", "API Connectored called from Azure AD B2C Service."));
    }
  }
}
