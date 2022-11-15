import React from "react";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, tokenSelector } from "../recoil_state";

import {
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";

export const Nav = () => {
  const user = useRecoilValue(userState);
  const token = useRecoilValue(tokenSelector);
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton>
            <img id="logo" src={logo} alt="logo" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Spotification
          </Typography>
          {!user.id || !token ? (
            <Button color="inherit">
              <a className="nav-link pl-2">login</a>
            </Button>
          ) : (
            <>
              <Typography component="div">{user.display_name}</Typography>
              {/* <Link to="/login">Not you?</Link> */}
            </>
          )}
        </Toolbar>
      </Container>
      <div id="menu-divider"></div>
    </AppBar>
  );
};
