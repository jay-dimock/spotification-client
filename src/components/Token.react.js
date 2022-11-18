import React, { useState } from "react";
import queryString from "query-string";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { tokenInfoState } from "../recoil_state";
import { createTokenInfoObject } from "../util/createTokenInfoObject";
import { useLoadInitialSpotifyData } from "../services/useLoadInitialSpotifyData";

export const Token = () => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [loading, setLoading] = useState(true);
  const params = queryString.parse(window.location.search);

  const info = createTokenInfoObject(
    params,
    tokenInfo.access_token,
    tokenInfo.refresh_token
  );

  const loadData = useLoadInitialSpotifyData();
  if (loading) {
    loadData(info).then(setLoading(false));
  }

  if (loading) {
    console.log("LOADING");
  }

  return <>{loading ? <div>Loading...</div> : <Navigate to="/" />}</>;
};
