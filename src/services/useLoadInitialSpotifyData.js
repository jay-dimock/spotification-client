import { useCallback } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userState, tokenInfoState, playlistsState } from "../recoil_state";

export const useLoadInitialSpotifyData = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const [, setUser] = useRecoilState(userState);
  const [, setPlaylists] = useRecoilState(playlistsState);

  return useCallback(
    async (newTokenInfo) => {
      console.log("tokenInfo.access_token", tokenInfo.access_token);
      if (
        !newTokenInfo ||
        !newTokenInfo.access_token ||
        newTokenInfo.access_token === tokenInfo.access_token
      ) {
        console.log("nothing needs doing");
        return false;
      }
      console.log("getting data...");
      const headers = {
        Authorization: "Bearer " + newTokenInfo.access_token,
      };

      const loadUser = async () => {
        const response = await axios.get("https://api.spotify.com/v1/me", {
          headers,
        });
        const data = await response.data;
        console.log(data);
        if (data?.id && data?.display_name) {
          console.log("fetched user data");
          let imageUrl = null;
          if (data.images && data.images.length > 0) {
            imageUrl = data.images[0].url;
          }
          return {
            display_name: data.display_name,
            id: data.id,
            product: data.product,
            image_url: imageUrl,
          };
        }
        return null;
      };

      const loadPlaylists = async () => {
        const playlists = [];

        const getPlaylists = async (endpoint) => {
          await axios
            .get(endpoint, { headers })
            .then((response) => {
              console.log(endpoint);
              populateList(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        };

        const populateList = async (data) => {
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
            await getPlaylists(data.next);
          } else {
            playlists.sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );
            console.log("populateList - playlists", playlists);
            setPlaylists(playlists);
          }
        };

        const limit = 50; // max Spotify allows us to get at a time
        const firstEndpoint = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
        await getPlaylists(firstEndpoint);
      };

      loadUser()
        .then((user) => {
          if (!user) {
            return;
          }
          setUser(user);
          setTokenInfo(newTokenInfo);
          loadPlaylists()
            .then(console.log("finished loading playlists"))
            .catch(console.error);
        })
        .catch(console.error);
    },
    [setPlaylists, setTokenInfo, setUser, tokenInfo.access_token]
  );
};
