import { useState, useContext } from 'react';

import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import { AppContext } from "../../AppContext";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import Typography from '@mui/material/Typography';

import Assessment from '@mui/icons-material/Assessment';
import Article from '@mui/icons-material/Article';

import Schema from '@mui/icons-material/Schema';

import DataLoading from './../DataLoading';

const Home = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts, inProgress, instance } = useMsal();
  const account = useAccount(accounts[0] || {});
  const navigate = useNavigate();
  const { embeddingData } = useContext(AppContext);

  const [alertIsOpen, setAlertIsOpen] = useState(true);

  if (!isAuthenticated) {
    return (
      <Container maxWidth={false}>
        <Typography variant='h5' component="h2" sx={{ my: 3 }} >Ready to Test Out the App-Owns-Data Starter Kit with Azure AD B2C?</Typography>
        <Alert sx={{ border: 1, padding: 2, mx: 2 }} severity='info' >
          This version of the <strong>AppOwnsDataReactClient</strong> application is a proof-of-concept which demonstrates how the signup and authorization
          features of Azure AD B2C can be leveraged when developing comercial applications with Power BI embedding using the <strong>Embed for Your Customers</strong> model (also known as <strong>App-Owns-Data embedding</strong>.
          You can test out the self-service signup experience by signing in using a <strong>work or school account</strong> that's been created by your organization
          in an Azure AD tenant. Note this type of user account also known as a <strong>Microsoft 365 account</strong>.

          <p>You also have the option of 
             signing up using existing social media accounts that you've created with one of the following identity providers.</p>
          
          <ul>
            <li><strong>LinkedIn</strong></li>
            <li><strong>Facebook</strong></li>
            <li><strong>Live.com (Microsoft personal accounts)</strong></li>
          </ul>

          <p>Alternatively, you can signup by creating a new <strong>local account</strong> in the <strong>Power BI Dev Camp B2C authority</strong>. All you need is a valid email address to
            get through the signup process. As you sign up by creating a local account, the Azure AD B2C service will automatically send 
            you an email message with an <strong>authorization code</strong> to verify your email address is valid. After you have retrieved the auth code and entered it
            on the local account signup page, you will be able to complete the signup process and view embedded reports as an authorized user.</p>

        <p>Click the <strong>LOGIN</strong> button in the upper right to get started.</p>

      </Alert>
      </Container >
    )
  }

if (isAuthenticated && embeddingData.user !== "" && embeddingData.tenantName === "" && !embeddingData.workspaceArtifactsLoading) {
  return (
    <Container maxWidth={false}>
      <Typography variant='h5' component="h2" sx={{ my: 3 }} >Welcome to the App-Owns-Data Starter Kit</Typography>
      <Alert sx={{ border: 1, padding: 2, mx: 2 }} severity='warning' >You user account has not been assigned to a tenant. You will
        not have access to any reports until your user account has been assigned to a tenant.</Alert>
    </Container>
  )
}

if (embeddingData.workspaceArtifactsLoading || inProgress !== "none") {
  return <DataLoading />
}

if (isAuthenticated && embeddingData.tenantName && !embeddingData.workspaceArtifactsLoading) {
  return (
    <Container maxWidth={false}>

      <Container maxWidth="xl">
        <Typography variant='h5' component="h2" sx={{ my: "8px" }} >Welcome to the App-Owns-Data Starter Kit</Typography>

        <Collapse in={alertIsOpen} >
          <Alert sx={{ border: 1 }} severity='info' onClose={() => { setAlertIsOpen(false); }} >
            Now that you have logged in, you can use the left navigation menu to navigate to the reports accessible within this tenant.
          </Alert>
        </Collapse>

        <Typography variant='h6' component="h4" sx={{ mt: 2, mb: "8px", borderBottom: 1, }} >Login Session Info:</Typography>

        <TableContainer component={Paper} sx={{ border: 1, backgroundColor: "#EEEEEE" }} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small" >
            <TableBody>
              <TableRow key={"idp"} >
                <TableCell scope="row" sx={{ width: "200px" }} >
                  Identity Provider:
                </TableCell>
                <TableCell><strong>{account.idTokenClaims.idp ?? "Local B2C Authority"}</strong></TableCell>
              </TableRow>

              <TableRow key={"username"} >
                <TableCell scope="row" sx={{ width: "200px" }} >
                  User Login:
                </TableCell>
                <TableCell><strong>{(account.idTokenClaims as any)?.email}</strong></TableCell>
              </TableRow>
              <TableRow key={"name"} >
                <TableCell scope="row" sx={{ width: "200px" }} >
                  User Display Name:
                </TableCell>
                <TableCell><strong>{account?.name}</strong></TableCell>
              </TableRow>
              <TableRow key={"tenant"} >
                <TableCell scope="row" sx={{ width: "200px" }} >
                  Tenant Name:
                </TableCell>
                <TableCell><strong>{embeddingData.tenantName}</strong></TableCell>
              </TableRow>
              <TableRow key={"userCanEdit"} >
                <TableCell scope="row">
                  User can edit content:
                </TableCell>
                <TableCell><strong>{String(embeddingData.userCanEdit)}</strong></TableCell>
              </TableRow>
              <TableRow key={"userCanCreate"} >
                <TableCell scope="row">
                  User can create content:
                </TableCell>
                <TableCell><strong>{String(embeddingData.userCanCreate)}</strong></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant='h6' component="h4" sx={{ mt: 2, borderBottom: 1, mb: "8px" }} >Tenant Contents</Typography>

        <Grid container >
          <Grid item xs={6} sx={{ pr: "4px" }} >
            <Box sx={{ fontSize: "1.1rem", color: "white", background: "linear-gradient(to bottom, #607D8B, #455A64, #607D8B )", padding: "2px", paddingLeft: "12px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} >
              Reports
            </Box>
            <List sx={{ backgroundColor: "#EEEEEE", border: "1px solid #CCCCCC" }} disablePadding  >
              {embeddingData.reports &&
                embeddingData.reports.map((report) => (
                  <ListItem key={report.id} divider dense sx={{ p: "2px", m: 0 }} >
                    <ListItemButton onClick={() => { navigate("/reports/" + report.id); }} sx={{ p: 0, m: "4px" }} >
                      <ListItemAvatar sx={{ p: 0, minWidth: "44px" }}>
                        <Avatar sx={{ width: "32px", height: "32px", ml: "4px", backgroundColor: "white" }}>
                          {report.reportType === "PowerBIReport" ?
                            <Assessment sx={{ color: "#455A64" }} /> :
                            <Article sx={{ color: "#455A64" }} />}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={report.name}
                        primaryTypographyProps={{ fontSize: "14px", fontWeight: "bold" }}
                        secondary={report.reportType === "PowerBIReport" ? "Power BI Report" : "Paginated Report"}
                        secondaryTypographyProps={{ fontSize: "12px", color: "#555555" }}
                        sx={{ p: 0, m: 0 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs={6} sx={{ pl: "4px" }}>
            <Box sx={{ fontSize: "1.1rem", color: "white", background: "linear-gradient(to bottom, #607D8B, #455A64, #607D8B )", padding: "2px", paddingLeft: "12px", borderTopLeftRadius: "4px", borderTopRightRadius: "4px" }} >
              Datasets
            </Box>
            <List sx={{ backgroundColor: "#EEEEEE", border: "1px solid #CCCCCC" }} disablePadding  >
              {embeddingData.datasets &&
                embeddingData.datasets.map((dataset) => (
                  <ListItem key={dataset.id} divider dense sx={{ p: "2px", m: 0 }} >
                    <ListItemButton onClick={() => { if (embeddingData.userCanCreate) { navigate("/datasets/" + dataset.id); } }} sx={{ p: 0, m: "4px" }} >
                      <ListItemAvatar sx={{ p: 0, minWidth: "44px" }}>
                        <Avatar sx={{ width: "32px", height: "32px", ml: "4px", pl: "6px", backgroundColor: "white" }}>
                          <Schema sx={{ color: "#455A64" }} /> :
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={dataset.name}
                        primaryTypographyProps={{ fontSize: "14px", fontWeight: "bold" }}
                        sx={{ p: 0, m: 0 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Container>
      <Box>
        &nbsp;
      </Box>
    </Container>
  )
}
}

export default Home;