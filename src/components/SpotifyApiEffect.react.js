import { useCallback, useEffect } from "react";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import {
  userState,
  tokenInfoState,
  tokenSelector,
  userIdSelector,
} from "../recoil_state";

// https://stackoverflow.com/questions/70718492/can-i-change-other-pieces-of-state-in-a-recoil-atom-effect
export const SpotifyApiEffect = () => {
  const token = useRecoilValue(tokenSelector);
  const userId = useRecoilValue(userIdSelector);
  const [user, setUser] = useRecoilState(userState);
  const resetTokenInfo = useResetRecoilState(tokenInfoState);
  const populateSpotifyValues = useCallback(async () => {
    if (!token) {
      // todo: reset userInfo?
      return;
    }
    const headers = {
      Authorization: "Bearer " + token,
    };
    fetch("https://api.spotify.com/v1/me", { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log("SpotifyApiEffect:", data.display_name);
        const userChanged = userId !== data.id;
        setUser({
          display_name: data.display_name,
          id: data.id,
          product: data.product,
        });
        if (userChanged) {
          console.log("user changed. time to refetch playlists.");
        } else {
          console.log("user did not change.");
        }
      })
      .catch((error) => {
        console.log(error);
        //resetTokenInfo();
      });
  }, [token, setUser, userId]);

  useEffect(() => void populateSpotifyValues(), [populateSpotifyValues]);
};
