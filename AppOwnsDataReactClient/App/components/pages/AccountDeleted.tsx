import React from 'react';

import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

const AccountDeleted = () => {

  return (
    <Container maxWidth={false}>
      <Typography variant='h5' component="h2" sx={{ my: 3 }} >Your Account Has Been Deleted</Typography>
      <Alert sx={{ border: 1, padding: 2, mx: 2 }} severity='success' >
        Your personal data has been removed from the <strong>Azure AD B2C tenant</strong> and from the <strong>Users</strong> table in the Azure SQL database
          named <strong>AppOwnsDataDB</strong> which tracks user permissions for the App-Owns-Data Starter Kit.
        <p>Thanks again for testing out the B2C account signup experience with the App-Owns-Data Starter Kit. Remember you can always sign up again later 
          anytime you'd like to test out the Azure AD B2C self-registration experience again or to demo this awesome developer sample
         to the others developers on your team.
        </p>
      </Alert>
    </Container>);
}

export default AccountDeleted;