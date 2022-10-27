using System.Threading.Tasks;
using Microsoft.Identity.Web.Resource;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AppOwnsDataWebApi.Models;
using AppOwnsDataWebApi.Services;

namespace AppOwnsDataWebApi.Controllers {

  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  [RequiredScope("Reports.Embed")]
  [EnableCors("AllowOrigin")]
  public class EmbedController : ControllerBase {

    private PowerBiServiceApi powerBiServiceApi;

    public EmbedController(PowerBiServiceApi powerBiServiceApi) {
      this.powerBiServiceApi = powerBiServiceApi;
    }

    [HttpGet]
    public async Task<EmbeddedViewModel> Get() {

      string user = this.User.FindFirst("email")?.Value;
      
      if (user == null) {
        throw new System.ApplicationException("Access token does not have email claim");
      }
      
      return await this.powerBiServiceApi.GetEmbeddedViewModel(user);
    }

  }

}
