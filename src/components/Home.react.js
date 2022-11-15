import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  busyState,
  userState,
  tokenSelector,
  userIdSelector,
  playlistsState,
} from "../recoil_state";

export const Home = () => {
  //const playlists = usePlaylists();
  //console.log(playlists);
  const busy = useRecoilValue(busyState);
  const user = useRecoilValue(userState);
  const userId = useRecoilValue(userIdSelector);
  const token = useRecoilValue(tokenSelector);
  const playlists = useRecoilValue(playlistsState);

  if (!busy && (!token || !user.id)) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <p>
        Welcome, {user.display_name}: {userId}
      </p>
      <p>total playlists:{playlists.length}</p>

      {/* {busy ? <p>Loading...</p> : <p>Welcome, {user.display_name}: </p>} */}

      {/* {!busy && !user?.id && <Navigate to="/login" />} */}

      <ul>
        {playlists.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
};
