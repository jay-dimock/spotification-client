import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tokenInfoState } from "../recoil_state";
import { createTokenInfoObject } from "../util/createTokenInfoObject";

export const Token = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const params = queryString.parse(window.location.search);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const info = createTokenInfoObject(
      params,
      tokenInfo.access_token,
      tokenInfo.refresh_token
    );
    if (info) {
      setTokenInfo(info);
    }
    setLoading(false);
  }, [params, setTokenInfo, tokenInfo.access_token, tokenInfo.refresh_token]);

  if (!loading && !params?.access_token && !tokenInfo.access_token) {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/" />;
};
