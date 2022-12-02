import { useCallback } from "react";
import axios from "axios";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import {
  userState,
  tokenInfoState,
  playlistsState,
  groupsState,
} from "../recoil_state";

export const useLoadInitialSpotifyData = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const [, setUser] = useRecoilState(userState);
  const [, setPlaylists] = useRecoilState(playlistsState);
  const [, setGroups] = useRecoilState(groupsState);

  return useCallback(
    async (newTokenInfo) => {
      // console.log("tokenInfo.access_token", tokenInfo.access_token);
      if (
        !newTokenInfo ||
        !newTokenInfo.access_token ||
        newTokenInfo.access_token === tokenInfo.access_token
      ) {
        // console.log("nothing needs doing");
        return false;
      }
      // console.log("getting data...");
      const headers = {
        Authorization: "Bearer " + newTokenInfo.access_token,
      };

      const loadUser = async () => {
        const response = await axios.get(SPOTIFY_BASE, {
          headers,
        });
        const data = await response.data;
        // console.log(data);
        if (data?.id && data?.display_name) {
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

      const loadPlaylists = async (groupData) => {
        console.log(groupData);
        const playlists = [];
        const groups = {};

        const getPlaylists = async (endpoint) => {
          await axios
            .get(endpoint, { headers })
            .then((response) => {
              // console.log(endpoint);
              //
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
          //console.log(chunk);
          const map = chunk.map((p) => {
            const isGroup = groupData.groups && groupData.groups.has(p.id);
            if (isGroup) {
              groups[p.id] = {
                spotifyId: p.id,
                name: p.name,
                playlistIds: groupData.groups[p.id],
              };
              return;
            }

            return {
              spotifyId: p.id,
              name: p.name,
              owner_name: p.owner.display_name,
              owner_id: p.owner.id,
              total_tracks: p.tracks.total,
              groupIds:
                groupData.playlists && groupData.playlists.has(p.id)
                  ? groupData.playlists[p.id]
                  : [],
            };
          });
          playlists.push(...map);

          if (data.next) {
            await getPlaylists(data.next);
          } else {
            playlists.sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );
            // console.log("populateList - playlists", playlists);
            setPlaylists(
              Object.fromEntries(playlists.map((p) => [p.spotifyId, p]))
            );
            setGroups(groups);
          }
        };

        const limit = 50; // max Spotify allows us to get at a time
        const firstEndpoint = `${SPOTIFY_BASE}/playlists?limit=${limit}`;
        await getPlaylists(firstEndpoint);
      };

      loadUser()
        .then((user) => {
          if (!user) {
            return;
          }
          setUser(user);
          setTokenInfo(newTokenInfo);
          axios
            .get(`${API_BASE}/groups/${user.id}`)
            .then((groupData) => {
              loadPlaylists(groupData)
                .then(console.log("finished loading playlists"))
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
    [setPlaylists, setTokenInfo, setUser, tokenInfo.access_token]
  );
};
