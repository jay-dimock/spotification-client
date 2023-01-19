import axios from "axios";
import { APP_API_BASE } from "../constants/EnvConstants";

export const useUpdateGroup = () => {
  return async (group, newPlaylistIds) => {
    if (!group || !newPlaylistIds) {
      console.error("group or playlistIds is missing");
      return null;
    }
    const updatedGroup = await axios
      .put(`${APP_API_BASE}/groups/${group.spotify_id}`, newPlaylistIds)
      .then(() => {
        return { ...group, playlist_ids: [...new Set(newPlaylistIds)] };
      })
      .catch((err) => {
        console.log(err);
        return null;
      });
    return updatedGroup;
  };
};
