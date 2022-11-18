import React from "react";
import { API_BASE } from "../constants/EnvConstants";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { userState, tokenInfoState, playlistsState } from "../recoil_state";

import {
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";

export const Nav = () => {
  const user = useRecoilValue(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const resetTokenInfo = useResetRecoilState(tokenInfoState);
  const resetUser = useResetRecoilState(userState);
  const resetPlaylists = useResetRecoilState(playlistsState);

  const logout = () => {
    resetTokenInfo();
    resetUser();
    resetPlaylists();
  };

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
          {!user.id || !tokenInfo.access_token ? (
            <a href={`${API_BASE}/auth/login`}>Log In</a>
          ) : (
            <Stack direction="row" spacing={2}>
              <Avatar alt={user.display_name} src={user.image_url} />
              <div>
                <Typography>{user.display_name}</Typography>
                <Typography variant="subtitle2" onClick={logout}>
                  <Link to="/login">Not you?</Link>
                </Typography>
              </div>
            </Stack>
          )}
        </Toolbar>
      </Container>
      <div id="menu-divider"></div>
    </AppBar>
  );
};
