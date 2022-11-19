import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, tokenInfoState, playlistsState } from "../recoil_state";
import { Playlists } from "./Playlists.react";

export const Home = () => {
  const user = useRecoilValue(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const playlists = useRecoilValue(playlistsState);

  if (!tokenInfo.access_token || !user.id) {
    return (
      <>
        <p>
          You are not logged in. Either your session has expired, or something
          went wrong during the login process.
        </p>
        <Link to="/login">Log in</Link>
      </>
    );
  }

  return <Playlists />;
};
