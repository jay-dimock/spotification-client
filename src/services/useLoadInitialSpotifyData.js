//import { useCallback } from "react";
import axios from "axios";
import {
  APP_API_BASE,
  SPOTIFY_ENDPOINT_USER,
  SPOTIFY_ENDPOINT_PLAYLISTS,
  spotifyHeaders,
} from "../constants/EnvConstants";
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

  return async (newTokenInfo) => {
    if (
      !newTokenInfo ||
      !newTokenInfo.access_token ||
      newTokenInfo.access_token === tokenInfo.access_token
    ) {
      return false;
    }
    const headers = spotifyHeaders(newTokenInfo.access_token);

    const loadUser = async () => {
      const data = await axios
        .get(SPOTIFY_ENDPOINT_USER, { headers })
        .then((res) => res.data)
        .catch(console.error);

      if (!data?.id || !data?.display_name) {
        return null;
      }
      let imageUrl = null;
      if (data.images && data.images.length > 0) {
        imageUrl = data.images[0].url;
      }
      const user = {
        display_name: data.display_name,
        id: data.id,
        product: data.product,
        image_url: imageUrl,
      };
      setUser(user);
      return user;
    };

    const getGroupsAndPlaylists = async (apiData) => {
      const playlists = [];
      const groups = [];
      const limit = 50; // max Spotify allows us to get at a time
      let endpoint = `${SPOTIFY_ENDPOINT_PLAYLISTS}?limit=${limit}`;

      while (endpoint) {
        const data = await axios
          .get(endpoint, { headers })
          .then((res) => res.data)
          .catch(console.error);

        const groupsChunk = data.items.filter(
          (item) => item.type === "playlist" && apiData.groups[item.id] != null
        );

        const playlistsChunk = data.items.filter(
          (item) => item.type === "playlist" && !apiData.groups[item.id]
        );

        groupsChunk.forEach((g) =>
          groups.push({
            spotify_id: g.id,
            name: getFriendlyName(g.name),
            full_name: g.name,
            playlist_ids: apiData.groups[g.id],
          })
        );

        playlistsChunk.forEach((p) =>
          playlists.push({
            spotify_id: p.id,
            name: p.name,
            owner_name: p.owner.display_name,
            owner_id: p.owner.id,
            total_tracks: p.tracks.total,
            group_ids:
              apiData.playlists[p.id] != null ? apiData.playlists[p.id] : [],
          })
        );

        endpoint = data.next;
      }

      return { groups, playlists };
    };

    const user = await loadUser();
    if (!user) {
      return;
    }

    setTokenInfo(newTokenInfo);

    const apiData = await axios
      .get(`${APP_API_BASE}/groups/${user.id}`)
      .then((res) => res.data)
      .catch(console.error);

    const stateData = await getGroupsAndPlaylists(apiData);

    const { groups, playlists } = stateData;

    playlists.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    setPlaylists(
      Object.fromEntries(
        // convert to dictionary
        playlists.map((p) => [p.spotify_id, p])
      )
    );

    groups.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    setGroups(
      Object.fromEntries(
        // convert to dictionary
        groups.map((g) => [g.spotify_id, g])
      )
    );
    await sync(groups, newTokenInfo);
  };
};
