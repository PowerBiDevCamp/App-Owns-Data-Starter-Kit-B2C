using AppOwnsDataShared.Services;
using Azure.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppOwnsDataAdmin.Services {

  public class B2CAccountsManager {

    #region "Auth support"

    private string tenantId { get; }
    private string clientId { get; }
    private string clientSecret { get; }
    private ClientSecretCredential clientSecretCredential { get; }
    private GraphServiceClient graphClient { get; }

    const string TenantAdminObjectId = "4c24f2ec-8ac8-49ff-bffc-425fc55c14a9";

    private readonly string[] scopes = new[] { "https://graph.microsoft.com/.default" };

    public B2CAccountsManager(IConfiguration configuration) {
      this.tenantId = configuration["MicrosoftGraphB2C:TenantId"];
      this.clientId = configuration["MicrosoftGraphB2C:ClientId"];
      this.clientSecret = configuration["MicrosoftGraphB2C:ClientSecret"];
      TokenCredentialOptions options = new TokenCredentialOptions { AuthorityHost = AzureAuthorityHosts.AzurePublicCloud };
      this.clientSecretCredential = new ClientSecretCredential(this.tenantId,this.clientId, this.clientSecret, options);
      this.graphClient = new GraphServiceClient(this.clientSecretCredential, this.scopes);
    }

    #endregion 
    
    public List<User> GetUsers() {
      List<User> users = new List<User>();
      string userProperties = "id, identities, displayName, givenName, surname, userPrincipalName, creationType, otherMails, createdDateTime, accountEnabled";
      var usersResponse = graphClient.Users.Request().Select(userProperties).GetAsync().Result;
      foreach (User user in usersResponse) {
        if (user.Id != TenantAdminObjectId) {
          user.CreationType = GetIdentityProviderName(user);
          users.Add(user);
        }
      }
      return users;
    }

    public void DeleteUser(string userId) {
      graphClient.Users[userId].Request().DeleteAsync().Wait();
      return;
    }

    public User GetUser(string userId) {
      string userIdFilter = "id eq '" + userId + "'";
      string userProperties = "id, displayName, givenName, surname, otherMails, identities, userPrincipalName, creationType, createdDateTime, accountEnabled";
      var user = graphClient.Users.Request().Select(userProperties).Filter(userIdFilter).GetAsync().Result.Single();
      user.CreationType = GetIdentityProviderName(user);
      return user;
    }

    public User ToggleUserEnabled(string userId) {

      string userIdFilter = "id eq '" + userId + "'";
      string userProperties = "id, accountEnabled";
      var user = graphClient.Users.Request().Select(userProperties).Filter(userIdFilter).GetAsync().Result.Single();
      bool userStatus = user.AccountEnabled.Value;

      var updatedValues = new User {
        AccountEnabled = !userStatus
      };
      
      return this.graphClient.Users[user.Id].Request().UpdateAsync(updatedValues).Result;

    }


    public string GetIdentityProviderName(User user) {
      string issuer = user.Identities.Where(identity => identity.SignInType.Equals("federated")).FirstOrDefault()?.Issuer;
      if (string.IsNullOrEmpty(issuer) && user.CreationType == "LocalAccount") {
        return "Local B2C Account";
      }
      if (issuer.ToLower().Contains("facebook")) {
        return "Facebook";
      }
      if (issuer.ToLower().Contains("linkedin")) {
        return "LinkedIn";
      }
      if (issuer.ToLower().Contains("live.com")) {
        return "Microsoft Personal (live.com)";
      }
      if (issuer.ToLower().Contains("login.microsoftonline.com")) {
        string email = user.OtherMails.FirstOrDefault();        
        string domain = email.Substring(email.IndexOf('@') + 1);

        return "AAD Tenant (" + domain + ")";
      }
      return "Unknown IDP";
    }
  }
}
