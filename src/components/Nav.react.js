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
import { FAQ, ABOUT } from "../constants/ViewConstants";
import { ListViewSetterButton } from "./ListViewSetterButton.react";

import {
  Box,
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
  const connected = user.id && tokenInfo.access_token;

  const logout = () => {
    resetTokenInfo();
    resetUser();
    resetPlaylists();
    resetGroups();
    resetView();
    resetSyncing();
  };

  const faq = (
    <Link component="button" onClick={() => setView(FAQ)}>
      FAQ
    </Link>
  );

  const manage = (
    <ListViewSetterButton component="link">Manage</ListViewSetterButton>
  );

  const disconnect = (
    <Link component="button" onClick={logout}>
      Disconnect
    </Link>
  );

  const home = (
    <Link onClick={() => setView(ABOUT)} href="#">
      Home
    </Link>
  );

  const connect = (
    <Link href={`${APP_API_BASE}/auth/login`}>Connect to Spotify</Link>
  );

  const loggedOutMenuItems = (
    <Box sx={{ position: { xs: "static", sm: "absolute" }, right: 0 }}>
      <Typography variant="subtitle2">
        {view === FAQ ? home : faq}
        {" | "}
        {connect}
      </Typography>
    </Box>
  );

  const loggedInMenuItems = (
    <Box sx={{ position: { xs: "static", sm: "absolute" }, right: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Avatar
          alt={user.display_name}
          src={user.image_url}
          sx={{ display: { xs: "none", sm: "block" } }}
        />
        <div>
          <Typography sx={{ display: { xs: "none", sm: "block" } }}>
            {user.display_name}
          </Typography>
          <Typography variant="subtitle2">
            {view === FAQ ? manage : faq}
            {" | "}
            {disconnect}
          </Typography>
        </div>
      </Stack>
    </Box>
  );

  const branding = (
    <Stack
      direction="row"
      sx={{ alignItems: "center", mt: { xs: 2, sm: 0 } }}
      spacing={1}
    >
      <Avatar
        alt="S-logo"
        src={logo}
        sx={{ display: { xs: "none", sm: "block" } }}
      />
      <Avatar
        alt={user.display_name}
        src={user.image_url}
        sx={{ display: { xs: "block", sm: "none" } }}
      />
      <Typography variant="h5">Spotification</Typography>
      {syncing && (
        <Typography variant="subtitle2" ml={2}>
          (syncing...)
        </Typography>
      )}
    </Stack>
  );

  return (
    <AppBar position="sticky" color="secondary">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack
            width="100%"
            spacing={1}
            direction={{ xs: "column", sm: "row" }}
          >
            {branding}
            {connected ? loggedInMenuItems : loggedOutMenuItems}
          </Stack>
        </Toolbar>
      </Container>
      <div id="menu-divider"></div>
    </AppBar>
  );
};
