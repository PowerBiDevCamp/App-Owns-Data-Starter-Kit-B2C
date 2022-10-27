import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import PageNotAccessible from './../PageNotAccessible';
import { Button } from '@mui/material';

import AppOwnsDataWebApi from './../../services/AppOwnsDataWebApi';

const DeleteMyAccount = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();

  const deleteMyAccount = async () => {
    await AppOwnsDataWebApi.DeleteMyAccount();
    navigate("/accountdeleted");
    instance.logoutRedirect({ postLogoutRedirectUri: "/accountdeleted" })
  };

  if (!isAuthenticated) {
    return <PageNotAccessible />;
  }
  else {
    return (
      <Container maxWidth={false}>
        <Typography variant='h5' component="h2" sx={{ my: 3 }} >Sorry To See You Go</Typography>
        <Alert sx={{ border: 1, padding: 2, mx: 2 }} severity='warning' >
          Thanks for testing out the B2C account signup experience with the App-Owns-Data Starter Kit. We really hope you see the great synergy that
          exists between Azure AD B2C and App-Owns-Data embedding.
          <p>When you delete your account, all your personal data will be deleted from the Power BI Dev Camp B2C Authority
            and from the App-Owns-Data database named AppOwnsDataDB. Remember you can always sign up again later anytime you would like.
          </p>
          <div>
            <Button onClick={deleteMyAccount} variant='outlined' sx={{ mt: "12px", color: "darkred", backgroundColor: "white", border: "2px solid darkred", fontSize: "16px" }} >DELETE MY ACCOUNT</Button>
          </div>
        </Alert>
      </Container>);
  }
}

export default DeleteMyAccount;