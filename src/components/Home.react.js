import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  busyState,
  userState,
  tokenInfoState,
  playlistsState,
} from "../recoil_state";

export const Home = () => {
  const busy = useRecoilValue(busyState);
  const user = useRecoilValue(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const playlists = useRecoilValue(playlistsState);

  if (!busy && (!tokenInfo.access_token || !user.id)) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <p>
        Welcome, {user.display_name}: {user.id}
      </p>
      <p>total playlists:{playlists.length}</p>
      <ul>
        {playlists.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
};
