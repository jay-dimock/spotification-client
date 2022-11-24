import React, { useState } from "react";
import queryString from "query-string";
import { Navigate } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { viewState, tokenInfoState } from "../recoil_state";
import { createTokenInfoObject } from "../util/createTokenInfoObject";
import { useLoadInitialSpotifyData } from "../services/useLoadInitialSpotifyData";
import { ABOUT } from "../constants/ViewConstants";

export const Token = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [, setView] = useRecoilState(viewState);
  const [loading, setLoading] = useState(true);
  const params = queryString.parse(window.location.search);

  const info = createTokenInfoObject(
    params,
    tokenInfo.access_token,
    tokenInfo.refresh_token
  );

  const loadData = useLoadInitialSpotifyData();
  if (loading) {
    loadData(info).then(() => {
      setView(ABOUT);
      setLoading(false);
    });
  }

  return <>{loading ? <div>Loading...</div> : <Navigate to="/" />}</>;
};
