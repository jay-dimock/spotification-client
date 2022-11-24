import React, { useEffect } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { viewState, tokenInfoState } from "../recoil_state";
import { Playlists } from "./Playlists.react";
import { About } from "./About.react";
import { FAQ as FAQPage } from "./FAQ.react";
import { ABOUT, MANAGE, FAQ } from "../constants/ViewConstants";

export const Home = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [view, setView] = useRecoilState(viewState);

  useEffect(() => {
    if (!tokenInfo.access_token && view === MANAGE) {
      setView(ABOUT);
    }
  });

  const getView = () => {
    switch (view) {
      case MANAGE:
        return <Playlists />;
      case FAQ:
        return <FAQPage />;
      default:
        return <About />;
    }
  };

  return getView();
};
