using Microsoft.AspNetCore.Mvc;
using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using System.Security.Claims;

namespace AppOwnsDataWebApi.Controllers {

  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [RequiredScope("Reports.Embed")]
  [EnableCors("AllowOrigin")]
  public class UserLoginController : ControllerBase {

    private AppOwnsDataDBService appOwnsDataDBService;

    public UserLoginController(AppOwnsDataDBService appOwnsDataDBService) {
      this.appOwnsDataDBService = appOwnsDataDBService;
    }

    [HttpPost]
    public ActionResult<User> PostUser() {

      string userEmail = this.User.FindFirst("email")?.Value;
      string userDisplayName = this.User.FindFirst("name")?.Value;

      if (userEmail == null) {
        throw new System.ApplicationException("Access token does not have email claim");
      }

      this.appOwnsDataDBService.ProcessUserLogin(new User {
        LoginId = userEmail,
        UserName = userDisplayName
      });

      return NoContent();
    }
  }
}
