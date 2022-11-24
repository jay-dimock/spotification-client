import { Login } from "./Login.react";
import { AboutBasic } from "./AboutBasic.react";
import { useRecoilValue, useRecoilState } from "recoil";
import { viewState, tokenInfoState } from "../recoil_state";
import { MANAGE } from "../constants/ViewConstants";
import { Button, Typography } from "@mui/material";
import React from "react";

export const About = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [, setView] = useRecoilState(viewState);
  return (
    <div className="container-inner">
      <h2>Welcome to Spotification!</h2>
      <AboutBasic />
      {!tokenInfo.access_token ? (
        <Login />
      ) : (
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => setView(MANAGE)}
        >
          <Typography>Manage Playlists</Typography>
        </Button>
      )}
    </div>
  );
};
