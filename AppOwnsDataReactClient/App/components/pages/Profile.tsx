import { useState, useContext } from 'react';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import { AppContext } from "../../AppContext";

import PageNotAccessible from './../PageNotAccessible';
import DataLoading from './../DataLoading';

import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const Profile = () => {
  const isAuthenticated = useIsAuthenticated();
  const { accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [showTokenClaims, setShowTokenClaims] = useState(false);
  const { embeddingData } = useContext(AppContext);


  if (!isAuthenticated) {
    return <PageNotAccessible />;
  }

  if (inProgress !== "none" || embeddingData.workspaceArtifactsLoading) {
    return <DataLoading />
  }

  return (
    <Container maxWidth="xl" sx={{ pb: "24px" }}>
      <Typography variant='h5' component="h2" sx={{ my: 3 }} >Azure AD B2C Account Information</Typography>

      <Table aria-label="simple table" sx={{ marginTop: "12px" }}>
        <TableHead sx={{ "& th": { color: "white", backgroundColor: "black" } }} >
          <TableRow>
            <TableCell>Profile Property</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key={"idp"}>
            <TableCell component="th" scope="row">Identity Provider</TableCell>
            <TableCell>{(account?.idTokenClaims as any)?.idp ?? "Local B2C Consumer Account"}</TableCell>
          </TableRow>
          <TableRow key={"name"}>
            <TableCell component="th" scope="row">Display Name</TableCell>
            <TableCell>{account?.name}</TableCell>
          </TableRow>
          <TableRow key={"email"}>
            <TableCell component="th" scope="row">email</TableCell>
            <TableCell>{(account.idTokenClaims as any).email}</TableCell>
          </TableRow>
          <TableRow key={"localAccountId"}>
            <TableCell component="th" scope="row">localAccountId</TableCell>
            <TableCell>{account?.localAccountId}</TableCell>
          </TableRow>
          <TableRow key={"tenantId"}>
            <TableCell component="th" scope="row">tenantId</TableCell>
            <TableCell>{account?.tenantId}</TableCell>
          </TableRow>
          <TableRow key={"environment"}>
            <TableCell component="th" scope="row">environment</TableCell>
            <TableCell>{account?.environment}</TableCell>
          </TableRow>
          <TableRow key={"policy"}>
            <TableCell component="th" scope="row">B2C policy (tfp)</TableCell>
            <TableCell>{(account.idTokenClaims as any)?.tfp}</TableCell>
          </TableRow>
          <TableRow key={"acr"}>
            <TableCell component="th" scope="row">Authentication Endpoint (acr)</TableCell>
            <TableCell>{(account.idTokenClaims as any).acr}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Divider />
      <br />

      <Button onClick={() => { setShowTokenClaims(!showTokenClaims); }} >
        {showTokenClaims ? "Hide Token Claims" : "Show All Claims in Azure AD B2C Token"}
      </Button>

      {showTokenClaims && (
        <>
          <Typography variant='h6' component="h3" sx={{ mt: "12px" }} >Raw Token Claims</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table" sx={{ mt: "12px", mb: "12px" }}>
              <TableHead sx={{ "& th": { color: "white", backgroundColor: "black" } }} >
                <TableRow>
                  <TableCell>Profile Property</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(account.idTokenClaims).map((key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">{key}</TableCell>
                    <TableCell>{(account.idTokenClaims[key] as string)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  )
}


export default Profile;