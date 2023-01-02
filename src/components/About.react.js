import { Login } from "./Login.react";
import { AboutBasic } from "./AboutBasic.react";
import { useRecoilValue } from "recoil";
import { tokenInfoState } from "../recoil_state";
import { aboutPage } from "../styles";
import { Container, Typography } from "@mui/material";
import { ListViewSetterButton } from "./ListViewSetterButton.react";
import React from "react";

export const About = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);

  return (
    <Container maxWidth="md" sx={aboutPage}>
      <h2>Welcome to Spotification!</h2>
      <AboutBasic />
      {!tokenInfo.access_token ? (
        <Login />
      ) : (
        <ListViewSetterButton variant="contained" sx={{ mt: 2 }}>
          <Typography>Manage Playlists</Typography>
        </ListViewSetterButton>
      )}
    </Container>
  );
};
