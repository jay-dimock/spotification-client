import axios from "axios";
import {
  spotifyEndpointTracks,
  spotifyHeaders,
} from "../constants/EnvConstants";

export const useAddTracks = () => {
  return async (tokenInfo, playlistId, trackUris) => {
    if (trackUris.length === 0) {
      return;
    }

    const headers = spotifyHeaders(tokenInfo.access_token);
    const endpoint = spotifyEndpointTracks(playlistId);

    // break track list into chunks of 100, which is
    // the max Spotify will accept at one time.
    const chunks = [];
    for (let i = 0; i < trackUris.length; i = i + 100) {
      const end = i + 100 > trackUris.length ? trackUris.length : i + 100;
      chunks.push(trackUris.slice(i, end));
    }

    for (const chunk of chunks) {
      await axios
        .post(endpoint, { uris: chunk }, { headers })
        .then((res) => res)
        .catch(console.error);
    }
  };
};
