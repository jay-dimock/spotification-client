import React, { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { viewState, tokenInfoState } from "../recoil_state";
import { Playlists } from "./Playlists.react";
import { Groups } from "./Groups.react";
import { About } from "./About.react";
import { FAQ as FAQPage } from "./FAQ.react";
import { Box } from "@mui/material";
import {
  ABOUT,
  MANAGE_PLAYLISTS,
  MANAGE_GROUPS,
  FAQ,
} from "../constants/ViewConstants";

export const Home = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [view, setView] = useRecoilState(viewState);

  useEffect(() => {
    if (
      !tokenInfo.access_token &&
      (view === MANAGE_PLAYLISTS || view === MANAGE_GROUPS)
    ) {
      setView(ABOUT);
    }
  });

  const getView = () => {
    switch (view) {
      case MANAGE_PLAYLISTS:
        return <Playlists />;
      case MANAGE_GROUPS:
        return <Groups />;
      case FAQ:
        return <FAQPage />;
      default:
        return <About />;
    }
  };

  return <Box paddingTop={2}>{getView()}</Box>;
};
