import { Configuration, RedirectRequest, LogLevel } from "@azure/msal-browser";

// Config Azure AD app setting to be passed to Msal on creation
const ClientId = "33333333-3333-3333-3333-333333333333";

export const tenantName = "YOUR_TENANT_NAME";
export const authorityDomain = tenantName + ".b2clogin.com";
export const tenantDomain = tenantName + ".onmicrosoft.com";
const basePolicyUrl = "https://" + authorityDomain + "/" + tenantDomain + "/";

export const AppOwnsDataApiPermissionScopes: string[] = [
  "https://" + tenantDomain + "/" + ClientId + "/Reports.Embed"
]

// define B2C policy names
const signUpSignIn = "b2c_1_susi";
const signIn = "B2C_1_signin";
const signUp = "B2C_1_signup";
const customSignUpSignIn = "B2C_1A_SIGNUP_SIGNIN";
const customEditProfile = "B2C_1A_PROFILEEDIT";
const resetPassword = "b2c_1_reset";
const editProfile = "b2c_1_edit_profile";

export const b2cPolicies = {
  names: {
    signUpSignIn: signUpSignIn,
    signIn: signIn,
    signUp: signUp,
    customSignUpSignIn: customSignUpSignIn,
    customEditProfile: customEditProfile,
    resetPassword: resetPassword,
    editProfile: editProfile
  },
  authorities: {
    signUpSignIn: {
      authority: basePolicyUrl + customSignUpSignIn,
    },
    forgotPassword: {
      authority: basePolicyUrl + resetPassword,
    },
    editProfile: {
      authority: basePolicyUrl + customEditProfile
    }
  },
  authorityDomain: authorityDomain
}

export const msalConfig: Configuration = {
  auth: {
    clientId: ClientId,
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: "/",
    postLogoutRedirectUri: "/",
    navigateToLoginRequestUrl: true
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      }
    }
  }

};

export const SignupSigninRequest: RedirectRequest = {
  scopes: AppOwnsDataApiPermissionScopes,
  redirectStartPage: window.location.href
};

export const TokenRequest: RedirectRequest = {
  scopes: AppOwnsDataApiPermissionScopes
};