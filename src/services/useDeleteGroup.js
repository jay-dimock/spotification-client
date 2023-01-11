import axios from "axios";
import { APP_API_BASE } from "../constants/EnvConstants";
import { useGetRefreshedToken } from "./useGetRefreshedToken";
import {
  spotifyEndpointUnfollowPlaylist,
  spotifyHeaders,
} from "../constants/EnvConstants";

export const useDeleteGroup = () => {
  const getRefreshedToken = useGetRefreshedToken();
  return async (tokenInfo, groupId) => {
    if (!groupId) {
      console.error("Group ID is missing");
      return false;
    }
    const apiSuccess = await axios
      .delete(`${APP_API_BASE}/groups/${groupId}`)
      .then(() => true)
      .catch((err) => {
        console.error(err);
        return false;
      });

    if (!apiSuccess) {
      return false;
    }

    const currentTokenInfo = await getRefreshedToken(tokenInfo);
    const headers = spotifyHeaders(currentTokenInfo.access_token);

    // Spotify does not delete playlists, but if you unfollow your own
    // playlist, it has the same effect deleting it. See:
    // https://developer.spotify.com/documentation/general/guides/working-with-playlists/#:~:text=We%20have%20no%20endpoint%20for,you%20are%20simply%20unfollowing%20it.
    const endpoint = spotifyEndpointUnfollowPlaylist(groupId);

    const spotifySuccess = await axios
      .delete(endpoint, { headers: headers })
      .then(() => true)
      .catch((err) => {
        console.error(err);
        return false;
      });

    return spotifySuccess;
  };
};
