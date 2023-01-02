import { useCallback } from "react";
import axios from "axios";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import { getFriendlyName } from "../util/groupNameConfig";
import { useSyncSpotify } from "./useSyncSpotify";
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
  const sync = useSyncSpotify();

  return useCallback(
    async (newTokenInfo) => {
      if (
        !newTokenInfo ||
        !newTokenInfo.access_token ||
        newTokenInfo.access_token === tokenInfo.access_token
      ) {
        return false;
      }
      const headers = {
        Authorization: "Bearer " + newTokenInfo.access_token,
      };

      const loadUser = async () => {
        const response = await axios.get(SPOTIFY_BASE, {
          headers,
        });
        const data = await response.data;
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
            const isGroup = groupData.groups && groupData.groups[p.id] != null;
            if (isGroup) {
              groups[p.id] = {
                spotify_id: p.id,
                name: getFriendlyName(p.name),
                full_name: p.name,
                playlist_ids: groupData.groups[p.id],
              };
              return null;
            }

            return {
              spotify_id: p.id,
              name: p.name,
              owner_name: p.owner.display_name,
              owner_id: p.owner.id,
              total_tracks: p.tracks.total,
              group_ids:
                groupData.playlists[p.id] != null
                  ? groupData.playlists[p.id]
                  : [],
            };
          });
          playlists.push(...map);

          if (data.next) {
            await getPlaylists(data.next);
          } else {
            const filteredPlaylists = playlists.filter((p) => p);
            filteredPlaylists.sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );

            setPlaylists(
              Object.fromEntries(
                // convert to dictionary
                filteredPlaylists.map((p) => [p.spotify_id, p])
              )
            );
            const sortedGroups = Object.values(groups).sort((a, b) =>
              a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
            );
            setGroups(
              Object.fromEntries(
                // convert to dictionary
                sortedGroups.map((g) => [g.spotify_id, g])
              )
            );
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
              loadPlaylists(groupData.data).then(sync()).catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    },
    [setPlaylists, setGroups, setTokenInfo, setUser, tokenInfo.access_token]
  );
};
