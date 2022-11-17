import { useCallback, useEffect } from "react";
import { API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  busyState,
  userState,
  tokenInfoState,
  playlistsState,
} from "../recoil_state";
import { tokenIsExpired } from "../util/tokenIsExpired";
import { createTokenInfoObject } from "../util/createTokenInfoObject";

// https://stackoverflow.com/questions/70718492/can-i-change-other-pieces-of-state-in-a-recoil-atom-effect
export const SpotifyApiEffect = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const [user, setUser] = useRecoilState(userState);
  const [busy, setBusy] = useRecoilState(busyState);
  const [, setPlaylists] = useRecoilState(playlistsState);

  useEffect(() => {
    if (busy || !tokenIsExpired(tokenInfo.expires_at)) {
      return;
    }
    setBusy(true);
    const endpoint = `${API_BASE}/auth/refresh?refresh_token=${tokenInfo.refresh_token}`;
    axios
      .get(endpoint)
      .then((response) => {
        console.log(response.data);
        const info = createTokenInfoObject(
          response.data,
          tokenInfo.access_token,
          tokenInfo.refresh_token
        );
        if (info) {
          setTokenInfo(info);
        }
        setBusy(false);
      })
      .catch((err) => {
        console.log(err);
        setBusy(false);
      });
  }, [
    busy,
    setBusy,
    setTokenInfo,
    tokenInfo.access_token,
    tokenInfo.expires_at,
    tokenInfo.refresh_token,
  ]);
  // trying to refactor, but too tired...
  //  useEffect(()=>{
  //   if (!tokenInfo.access_token) {
  //       return;
  //     }
  //   const headers = {
  //       Authorization: "Bearer " + tokenInfo.access_token,
  //     };
  //   const getUserData = async () => {
  //     const response = await axios.get("https://api.spotify.com/v1/me", {
  //       headers,
  //     });
  //     const data = response.data;
  //     console.log("display_name:", data.display_name);
  //     console.log("user.id:", user.id);
  //     console.log("data.id:", data.id);
  //     const userChanged = user.id !== data.id;
  //     setUser({
  //       display_name: data.display_name,
  //       id: data.id,
  //       product: data.product,
  //     });
  //     if (userChanged) {
  //       console.log("user changed. time to refetch playlists.");
  //       //updatePlaylists();
  //     } else {
  //       console.log("user did not change.");
  //       setBusy(false);
  //       return;
  //     }
  //   }

  //  })

  const populateSpotifyValues = useCallback(async () => {
    if (!tokenInfo.access_token) {
      return;
    }

    const headers = {
      Authorization: "Bearer " + tokenInfo.access_token,
    };
    axios
      .get("https://api.spotify.com/v1/me", { headers })
      .then((response) => {
        const data = response.data;
        console.log("display_name:", data.display_name);
        console.log("user.id:", user.id);
        console.log("data.id:", data.id);
        const userChanged = user.id !== data.id;
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
        // resetTokenInfo();
        setBusy(false);
      });

    const updatePlaylists = () => {
      const headers = {
        Authorization: "Bearer " + tokenInfo.access_token,
      };

      const playlists = [];

      const getPlaylists = (endpoint) => {
        axios
          .get(endpoint, { headers })
          .then((response) => {
            console.log(endpoint);
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
  }, [
    setUser,
    setBusy,
    //resetTokenInfo,
    setPlaylists,
    user.id,
    tokenInfo.access_token,
  ]);

  useEffect(() => void populateSpotifyValues(), [populateSpotifyValues]);
  return null;
};
