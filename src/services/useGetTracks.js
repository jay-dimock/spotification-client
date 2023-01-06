import axios from "axios";
import {
  spotifyEndpointTracks,
  spotifyHeaders,
} from "../constants/EnvConstants";

export const useGetTracks = () => {
  return async (tokenInfo, playlistId) => {
    console.log("getTracks-> playlistId", playlistId);
    const headers = spotifyHeaders(tokenInfo.access_token);
    const trackUris = [];
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
      const map = chunk.map((item) => item.track.uri);
      trackUris.push(...map);
      endpoint = data.next;
    }
    return trackUris;
  };
};
