import React from "react";
import queryString from "query-string";
import { Navigate } from "react-router-dom";
import { createTokenInfoObject } from "../util/createTokenInfoObject";
import { useLoadInitialSpotifyData } from "../services/useLoadInitialSpotifyData";

export const Token = () => {
  const loadData = useLoadInitialSpotifyData();
  const params = queryString.parse(window.location.search);
  const info = createTokenInfoObject(params, null, null);

  loadData(info);
  return <Navigate to="/" />;
};
