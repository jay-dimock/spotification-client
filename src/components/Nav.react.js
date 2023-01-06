import React from "react";
import { APP_API_BASE } from "../constants/EnvConstants";
import logo from "../images/logo.png";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import {
  viewState,
  userState,
  tokenInfoState,
  playlistsState,
  groupsState,
  syncingState,
} from "../recoil_state";
import { FAQ } from "../constants/ViewConstants";
import { ListViewSetterButton } from "./ListViewSetterButton.react";

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
  const syncing = useRecoilValue(syncingState);
  const resetTokenInfo = useResetRecoilState(tokenInfoState);
  const resetUser = useResetRecoilState(userState);
  const resetPlaylists = useResetRecoilState(playlistsState);
  const resetGroups = useResetRecoilState(groupsState);
  const resetView = useResetRecoilState(viewState);
  const resetSyncing = useResetRecoilState(syncingState);
  const [view, setView] = useRecoilState(viewState);

  const logout = () => {
    resetTokenInfo();
    resetUser();
    resetPlaylists();
    resetGroups();
    resetView();
    resetSyncing();
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton>
            <img id="logo" src={logo} alt="logo" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Spotification
            {syncing && <Typography variant="subtitle2">syncing...</Typography>}
          </Typography>

          {!user.id || !tokenInfo.access_token ? (
            <Link href={`${APP_API_BASE}/auth/login`}>Connect to Spotify</Link>
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
                    <ListViewSetterButton component="link">
                      Manage
                    </ListViewSetterButton>
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
