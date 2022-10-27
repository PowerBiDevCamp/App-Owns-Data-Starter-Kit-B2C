import { createRoot } from "react-dom/client";

import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./AuthConfig";

export const msalInstance = new PublicClientApplication(msalConfig);
import App from './App';

// let userLoginProcessed = false;
// await AppOwnsDataWebApi.LoginUser((account.idTokenClaims as any).email, account.name);
  
const root = createRoot(document.getElementById('root'));

root.render(
  <MsalProvider instance={msalInstance} >
    <App />
  </MsalProvider>
);