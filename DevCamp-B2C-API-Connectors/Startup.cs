using AppOwnsDataShared.Models;
using AppOwnsDataShared.Services;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;

[assembly: FunctionsStartup(typeof(DevCamp_B2C_API_Connectors.Startup))]

namespace DevCamp_B2C_API_Connectors {
  public class Startup : FunctionsStartup {
    public override void Configure(IFunctionsHostBuilder builder) {

      string connectString = Environment.GetEnvironmentVariable("AppOwnsDataDB");
      builder.Services.AddDbContext<AppOwnsDataDB>
          (options => options.UseSqlServer(connectString));

      builder.Services.AddScoped(typeof(AppOwnsDataDB));
      builder.Services.AddScoped(typeof(AppOwnsDataDBService));

    }

  }
}