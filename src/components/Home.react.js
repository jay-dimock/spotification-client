import React from "react";
import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil_state";
import { useGetUser } from "../services/useGetUser.react";

export const Home = () => {
  //const playlists = usePlaylists();
  //console.log(playlists);
  const user = useRecoilValue(userState);

  useGetUser();
  // if (!user.id) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <>
      <p>Welcome, {user.display_name}</p>
      {/* <ul>
        {playlists.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul> */}
    </>
  );
};
