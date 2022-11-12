import React, { useEffect, useRef } from "react";
import queryString from "query-string";
import { Navigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { tokenInfoState } from "../recoil_state";

export const Token = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const tokenFetchedRef = useRef(false);
  const params = queryString.parse(window.location.search);

  useEffect(() => {
    if (tokenFetchedRef.current) return;
    tokenFetchedRef.current = true;
    if (
      params?.access_token &&
      params.access_token !== tokenInfo.access_token
    ) {
      console.log("params?.access_token", params?.access_token);
      //updateUserInfo(params?.access_token);
      //updateTokenInfo(params);
      setTokenInfo({
        // only populate values we will use.
        access_token: params.access_token,
        expires_in: params.expires_in,
        refresh_token: params.refresh_token,
      });
    }
  }, [params, tokenInfo, setTokenInfo]);

  if (!params?.access_token && !tokenInfo.access_token) {
    return <Navigate to="/login" />;
  }
  if (!tokenFetchedRef.current) {
    return <p>Loading...</p>;
  }
  return <Navigate to="/" />;
};
