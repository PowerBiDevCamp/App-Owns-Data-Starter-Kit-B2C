import { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';

import { EventType, EventMessage } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import { msalConfig, b2cPolicies, AppOwnsDataApiPermissionScopes } from "./AuthConfig";
import { AppContext } from "./AppContext";

import { PowerBiReport, PowerBiDataset } from './models/models';
import AppOwnsDataWebApi from './services/AppOwnsDataWebApi';
import PageLayout from './components/PageLayout'

const App = () => {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts  } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [userLoginProcessed, setUserLoginProcessed ] = useState<boolean>(false)

  const [tenantName, setTenantName] = useState<string>("");
  const [reports, setReports] = useState<PowerBiReport[]>(null);
  const [datasets, setDatasets] = useState<PowerBiDataset[]>(null);
  const [user, setUser] = useState<string>("");
  const [userCanEdit, setUserCanEdit] = useState<boolean>(null);
  const [userCanCreate, setUserCanCreate] = useState<boolean>(null);
  const [workspaceArtifactsLoading, setWorkspaceArtifactsLoading] = useState<boolean>(false);

  const selectAccount = async () => {

    const currentAccounts = instance.getAllAccounts();

    // if the are no accounts in cache, do nothing
    if (currentAccounts.length < 1) {
      return;
    }
    // if there is 1 account, set that account as the active account
    if (currentAccounts.length === 1) {
      instance.setActiveAccount(currentAccounts[0]);
      if (!userLoginProcessed) {
        await AppOwnsDataWebApi.LoginUser();
        setUserLoginProcessed(true);
      }
      return;
    }

    // if there are multiple accounts, ensure the account with the signup/signin policy is active
    if (currentAccounts.length > 1) {
      let currentAccountPolicy = (instance.getActiveAccount()?.idTokenClaims as any)?.tfp.toUpperCase();
      let requiredAccountPolicy = b2cPolicies.names.signUpSignIn.toUpperCase();
      if (currentAccountPolicy !== requiredAccountPolicy) {
        console.log("WRONG ACCOUNT ACTIVE! - setting active account back to " + b2cPolicies.names.signUpSignIn);
        const filteredAccounts = currentAccounts.filter(account =>
          account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase()) &&
          account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase()) &&
          account.idTokenClaims.aud === msalConfig.auth.clientId
        );

        // determine if search found signup/signin policy account
        if (filteredAccounts.length > 0) {
          // if so, set signup/signin policy accountas active account
          console.log("Setting SignUp/Signin policy as active account", filteredAccounts[0])
          instance.setActiveAccount(filteredAccounts[0]);
        }
      }
      if (!userLoginProcessed) {
        await AppOwnsDataWebApi.LoginUser();
        setUserLoginProcessed(true);
      }
    }
  }

  const handleMsalEventCallback = async (event: EventMessage) => {
    switch (event.eventType) {
      case EventType.INITIALIZE_END:
      case EventType.LOGIN_SUCCESS:
      case EventType.ACQUIRE_TOKEN_SUCCESS:
        selectAccount();
        break;
    }
  };

  const refreshEmbeddingData = () => {
    const refreshEmbeddingDataAsync = async () => {
      let viewModel = await AppOwnsDataWebApi.GetEmbeddingData();
      setReports(viewModel.reports);
    };
    refreshEmbeddingDataAsync();
  };

  // this code executes just once to intitialize MSAL with callback function
  useEffect(() => {
    const callbackId = instance.addEventCallback(handleMsalEventCallback);
    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  }, []);

  useEffect(() => {
    const getEmbeddingDataAsync = async () => {
      setWorkspaceArtifactsLoading(true);
      let viewModel = await AppOwnsDataWebApi.GetEmbeddingData();
      setTenantName(viewModel.tenantName);
      setReports(viewModel.reports);
      setDatasets(viewModel.datasets);
      setUser(account.name);
      setUserCanEdit(viewModel.userCanEdit);
      setUserCanCreate(viewModel.userCanCreate);
      setWorkspaceArtifactsLoading(false);
    }
    if (isAuthenticated && userLoginProcessed) {
      getEmbeddingDataAsync()
    };

  }, [isAuthenticated, userLoginProcessed]);

  return (
    <AppContext.Provider value={{
      embeddingData: {
        tenantName: tenantName,
        reports: reports,
        datasets: datasets,
        user: user,
        userCanEdit: userCanEdit,
        userCanCreate: userCanCreate,
        workspaceArtifactsLoading: workspaceArtifactsLoading
      },
      refreshEmbeddingData: refreshEmbeddingData,
    }}>

      <CssBaseline />
      <BrowserRouter>
        <PageLayout />
      </BrowserRouter>

    </AppContext.Provider>
  )
}

export default App;