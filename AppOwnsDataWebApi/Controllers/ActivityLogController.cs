using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

using Microsoft.Identity.Web.Resource;

using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;

namespace AppOwnsDataWebApi.Controllers {

  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [RequiredScope("Reports.Embed")]
  [EnableCors("AllowOrigin")]
  public class ActivityLogController : ControllerBase {

    private readonly AppOwnsDataDBService appOwnsDataDBService;

    public ActivityLogController(AppOwnsDataDBService appOwnsDataDBService) {
      this.appOwnsDataDBService = appOwnsDataDBService;
    }

    [HttpPost]
    public ActionResult<ActivityLogEntry> PostActivityLogEntry(ActivityLogEntry activityLogEntry) {

      string userEmail = this.User.FindFirst("email")?.Value;
      string userDisplayName = this.User.FindFirst("name")?.Value;

      if (userEmail == null) {
        throw new System.ApplicationException("Access token does not have email claim");
      }

      // update entry with user data from access token
      activityLogEntry.LoginId = userEmail;
      activityLogEntry.User = userDisplayName;

      activityLogEntry = this.appOwnsDataDBService.PostActivityLogEntry(activityLogEntry);
      return Ok();
    }

  }
}
