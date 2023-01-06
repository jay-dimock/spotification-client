import axios from "axios";
import {
  spotifyEndpointTracks,
  spotifyHeaders,
} from "../constants/EnvConstants";

export const useRemoveTracks = () => {
  return async (tokenInfo, playlistId, trackUris) => {
    if (trackUris.length === 0) {
      return;
    }

    const headers = spotifyHeaders(tokenInfo.access_token);
    const endpoint = spotifyEndpointTracks(playlistId);
    const trackObjects = trackUris.map((uri) => {
      return { uri: uri };
    });

    // break track list into chunks of 100, which is
    // the max Spotify will accept at one time.
    const chunks = [];
    for (let i = 0; i < trackObjects.length; i = i + 100) {
      const end = i + 100 > trackObjects.length ? trackObjects.length : i + 100;
      chunks.push(trackObjects.slice(i, end));
    }

    for (const chunk of chunks) {
      await axios
        .delete(endpoint, { data: { tracks: chunk }, headers: headers })
        .then((res) => res)
        .catch(console.error);
    }
  };
};
