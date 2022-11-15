import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, tokenSelector, userIdSelector } from "../recoil_state";

export const Home = () => {
  //const playlists = usePlaylists();
  //console.log(playlists);
  const user = useRecoilValue(userState);
  const userId = useRecoilValue(userIdSelector);
  const token = useRecoilValue(tokenSelector);

  //useGetUser();
  // if (!user.id) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <>
      <p>
        Welcome, {user.display_name}: {userId}
      </p>
      <p>{token}</p>

      {/* {busy ? <p>Loading...</p> : <p>Welcome, {user.display_name}: </p>} */}

      {/* {!busy && !user?.id && <Navigate to="/login" />} */}

      {/* <ul>
        {playlists.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul> */}
    </>
  );
};
