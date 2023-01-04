import { useCallback } from "react";
import axios from "axios";
//import { useRefreshedToken } from "./useRefreshedToken";
import {
  spotifyEndpointTracks,
  spotifyHeaders,
} from "../constants/EnvConstants";

export const useGetTracks = () => {
  return async (tokenInfo, playlistId) => {
    const headers = spotifyHeaders(tokenInfo.access_token);
    const trackIds = [];
    let endpoint = spotifyEndpointTracks(playlistId);

    while (endpoint) {
      const data = await axios
        .get(endpoint, { headers })
        .then((res) => res.data)
        .catch(console.error);

      const chunk = data.items.filter((item) => {
        // Only reference items that are tracks and that are not 'local'.
        // Spotify api does not allow local items to be added to a new playlist.
        const itemIsTrack = !!item.track.track;
        return itemIsTrack && !item.track.is_local;
      });
      const map = chunk.map((item) => item.track.id);
      trackIds.push(...map);
      endpoint = data.next;
    }
    return trackIds;
  };
};
