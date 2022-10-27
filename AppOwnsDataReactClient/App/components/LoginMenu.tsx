import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal, useIsAuthenticated, useAccount } from "@azure/msal-react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

import AccountCircle from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/DeleteForever';

import { SignupSigninRequest } from "../AuthConfig";

const LoginMenu = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const loginUser = () => {
    instance.loginRedirect(SignupSigninRequest);
  };

  const onMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onMenuClose = () => {
    setAnchorEl(null);
  };

  const onNavigateToProfile = () => {
    setAnchorEl(null);
    navigate("profile")
  };

  const logoutUser = () => {
    setAnchorEl(null);
    navigate("/");
    instance.logoutRedirect();
  };

  const deleteMyAccount = () => {
    setAnchorEl(null);
    navigate("/deletemyaccount");
  };

  if (isAuthenticated) {
    return (
      <Box sx={{ marginLeft: "auto" }}>
        <Button
          sx={{ color: "white", mr: "12px;", mt: "4px" }}
          disableElevation
          onClick={onMenuOpen}
          startIcon={<AccountCircle />}
          endIcon={<KeyboardArrowDownIcon />} >
          {account?.name}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={onMenuClose} >
          <MenuItem onClick={onNavigateToProfile} disableRipple sx={{ width: 1 }} >
            <AccountCircle sx={{ mr: 1 }} />
            View My Account
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem onClick={logoutUser} disableRipple>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout of My Account
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem disableRipple sx={{ color: "darkred" }} onClick={deleteMyAccount} >
            <DeleteIcon sx={{ mr: 1, color: "darkred" }} />
            Delete My Account
          </MenuItem>
        </Menu>
      </Box>
    );
  }
  else {
    return (
      <Box sx={{ marginLeft: "auto", marginRight: "12px", pt: "4px" }}>
        <Button onClick={loginUser} color="inherit" startIcon={<LoginIcon />}  >Login</Button>
      </Box>
    );

  }
}

export default LoginMenu;