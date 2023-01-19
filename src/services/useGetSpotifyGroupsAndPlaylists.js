import axios from "axios";
import {
  APP_API_BASE,
  SPOTIFY_ENDPOINT_PLAYLISTS,
  spotifyHeaders,
} from "../constants/EnvConstants";
import { getFriendlyName } from "../util/groupNameConfig";

export const useGetSpotifyGroupsAndPlaylists = () => {
  return async (newTokenInfo, userId) => {
    const apiData = await axios
      .get(`${APP_API_BASE}/groups/${userId}`)
      .then((res) => res.data)
      .catch(console.error);

    const playlists = [];
    const groups = [];
    const limit = 50; // max Spotify allows us to get at a time
    const headers = spotifyHeaders(newTokenInfo.access_token);
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

    // if the user deleted/unfollowed an individual playlist in Spotify,
    // it needs to be removed from any groups it belongs to.
    const playlistIds = new Set(playlists.map((p) => p.spotify_id));
    for (const group of groups) {
      const originalLength = group.playlist_ids.length;
      group.playlist_ids = group.playlist_ids.filter((pid) =>
        playlistIds.has(pid)
      );
      if (group.playlist_ids.length < originalLength) {
        axios
          .put(`${APP_API_BASE}/groups/${group.spotify_id}`, group.playlist_ids)
          .then(() => {})
          .catch(console.error);
      }
    }

    playlists.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    const playlistsDict = Object.fromEntries(
      playlists.map((p) => [p.spotify_id, p])
    );
    groups.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
    const groupsDict = Object.fromEntries(groups.map((g) => [g.spotify_id, g]));
    return { groupsDict, playlistsDict };
  };
};
