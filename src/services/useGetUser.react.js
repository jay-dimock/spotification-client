import { useEffect } from "react";
import { userState, tokenInfoState } from "../recoil_state";
import { useRecoilState, useRecoilValue } from "recoil";

export const useGetUser = () => {
  const [user, setUser] = useRecoilState(userState);
  const tokenInfo = useRecoilValue(tokenInfoState);

  useEffect(() => {
    if (!tokenInfo.access_token) {
      return;
    }
    const headers = {
      Authorization: "Bearer " + tokenInfo.access_token,
    };

    fetch("https://api.spotify.com/v1/me", { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.display_name);
        //const userChanged = user.id !== data.id;
        setUser({
          display_name: data.display_name,
          id: data.id,
          product: data.product,
        });
        // if (userChanged) {
        //   updateSession({ playlists: [] });
        //   updatePlaylists(token);
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //return user;
};
