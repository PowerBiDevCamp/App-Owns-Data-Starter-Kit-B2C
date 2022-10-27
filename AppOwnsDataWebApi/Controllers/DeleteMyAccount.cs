using Microsoft.AspNetCore.Mvc;
using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web.Resource;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using System.Security.Claims;
using AppOwnsDataWebApi.Services;
using System.Threading.Tasks;

namespace AppOwnsDataWebApi.Controllers {

  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [RequiredScope("Reports.Embed")]
  [EnableCors("AllowOrigin")]
  public class DeleteMyAccount : ControllerBase {

    private AppOwnsDataDBService appOwnsDataDBService;
    private B2CAccountsManager b2cAccountsManager;

    public DeleteMyAccount(AppOwnsDataDBService appOwnsDataDBService, B2CAccountsManager b2cAccountsManager) {
      this.appOwnsDataDBService = appOwnsDataDBService;
      this.b2cAccountsManager = b2cAccountsManager;
    }

    [HttpPost]
    public async Task<ActionResult<User>> PostDeleteMyAccount() {

      string userEmail = this.User.FindFirst("email")?.Value;
      string b2cUserId = this.User.FindFirst("sub")?.Value;

      if (userEmail == null || b2cUserId == null) {
        throw new System.ApplicationException("Access token does not have email claim or sub claim with user id");
      }

      await this.b2cAccountsManager.DeleteUser(b2cUserId);
      this.appOwnsDataDBService.DeleteUser(new User { LoginId = userEmail });

      return NoContent();
    }

  }
}
