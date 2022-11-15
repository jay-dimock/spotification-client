import { useCallback, useEffect } from "react";
import axios from "axios";
import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import {
  busyState,
  userState,
  userIdSelector,
  tokenInfoState,
  tokenSelector,
  playlistsState,
} from "../recoil_state";

// https://stackoverflow.com/questions/70718492/can-i-change-other-pieces-of-state-in-a-recoil-atom-effect
export const SpotifyApiEffect = () => {
  const token = useRecoilValue(tokenSelector);
  const userId = useRecoilValue(userIdSelector);
  const [, setUser] = useRecoilState(userState);
  const [, setBusy] = useRecoilState(busyState);
  const [, setPlaylists] = useRecoilState(playlistsState);
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
          updatePlaylists();
        } else {
          console.log("user did not change.");
          setBusy(false);
        }
      })
      .catch((error) => {
        console.log(error);
        resetTokenInfo();
        setBusy(false);
      });

    const updatePlaylists = () => {
      const headers = {
        Authorization: "Bearer " + token,
      };

      const playlists = [];

      const getPlaylists = (endpoint) => {
        axios
          .get(endpoint, { headers })
          .then((response) => {
            console.log(endpoint);
            // console.log(response.data);
            populateList(response.data);
          })
          .catch((error) => {
            console.log(error);
            return false;
          });
      };

      const populateList = (data) => {
        if (!data) {
          return;
        }
        // remove podcasts, etc:
        const chunk = data.items.filter((p) => p.type === "playlist");
        const map = chunk.map((p) => {
          return {
            id: p.id,
            name: p.name,
            owner: p.owner.name,
            total_tracks: p.tracks.total,
          };
        });
        playlists.push(...map);

        if (data.next) {
          getPlaylists(data.next);
        } else {
          // console.log("populateList - playlists", playlists);
          playlists.sort((a, b) =>
            a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
          );
          console.log(playlists);
          setPlaylists(playlists);
          setBusy(false);
        }
      };

      const limit = 50; // max Spotify allows us to get at a time
      const firstEndpoint = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
      getPlaylists(firstEndpoint);
    };
  }, [token, setUser, userId, setBusy, resetTokenInfo, setPlaylists]);

  useEffect(() => void populateSpotifyValues(), [populateSpotifyValues]);
  return null;
};
