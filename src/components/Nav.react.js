import React from "react";
import { API_BASE } from "../constants/EnvConstants";
import logo from "../images/logo.png";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import {
  viewState,
  userState,
  tokenInfoState,
  playlistsState,
  groupsState,
} from "../recoil_state";
import { FAQ, MANAGE_PLAYLISTS } from "../constants/ViewConstants";

import {
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Stack,
  Link,
} from "@mui/material";

export const Nav = () => {
  const user = useRecoilValue(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const resetTokenInfo = useResetRecoilState(tokenInfoState);
  const resetUser = useResetRecoilState(userState);
  const resetPlaylists = useResetRecoilState(playlistsState);
  const resetGroups = useResetRecoilState(groupsState);
  const [view, setView] = useRecoilState(viewState);

  const logout = () => {
    resetTokenInfo();
    resetUser();
    resetPlaylists();
    resetGroups();
  };

  return (
    <AppBar position="static" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton>
            <img id="logo" src={logo} alt="logo" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Spotification
          </Typography>
          {!user.id || !tokenInfo.access_token ? (
            <Link href={`${API_BASE}/auth/login`}>Connect to Spotify</Link>
          ) : (
            <Stack direction="row" spacing={2}>
              <Avatar alt={user.display_name} src={user.image_url} />
              <div>
                <Typography>{user.display_name}</Typography>
                <Typography variant="subtitle2">
                  {view !== FAQ && (
                    <Link component="button" onClick={() => setView(FAQ)}>
                      FAQ
                    </Link>
                  )}
                  {view === FAQ && (
                    <Link
                      component="button"
                      onClick={() => setView(MANAGE_PLAYLISTS)}
                    >
                      Manage
                    </Link>
                  )}
                  {" | "}
                  <Link component="button" onClick={logout}>
                    Disconnect
                  </Link>
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
