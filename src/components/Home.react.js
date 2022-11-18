import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, tokenInfoState, playlistsState } from "../recoil_state";

export const Home = () => {
  const user = useRecoilValue(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const playlists = useRecoilValue(playlistsState);

  if (!tokenInfo.access_token || !user.id) {
    console.log("NAV TO LOGIN FROM HOME");
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
