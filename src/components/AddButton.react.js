import React from "react";
import { APP_API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilState } from "recoil";
import { playlistsState, groupsState } from "../recoil_state";
import { Typography, Button } from "@mui/material";
import { useSyncSpotify } from "../services/useSyncSpotify";

export const AddButton = (props) => {
  const { groupId, playlistId, clearSelection } = props;
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const sync = useSyncSpotify();

  const getUpdatedGroup = () => {
    const newPlaylistIds = [...groups[groupId].playlist_ids, playlistId];
    return {
      ...groups[groupId],
      playlist_ids: [...new Set(newPlaylistIds)],
    };
  };

  const updateRecoil = () => {
    const newGroupIds = [...playlists[playlistId].group_ids, groupId];
    const updatedPlaylist = {
      ...playlists[playlistId],
      group_ids: [...new Set(newGroupIds)],
    };
    const localPlaylists = { ...playlists };
    localPlaylists[playlistId] = updatedPlaylist;
    setPlaylists(localPlaylists);

    const localGroups = { ...groups };
    if (!localGroups[groupId]) {
      throw new Error(
        "Cannot update state: group is missing from state. Group ID: " + groupId
      );
    } else {
      localGroups[groupId] = getUpdatedGroup();
    }
    setGroups(localGroups);
  };

  const add = () => {
    if (!groupId || !playlistId) {
      console.error("groupId or playlistId is missing");
      return;
    }
    const updatedGroup = getUpdatedGroup();
    axios
      .put(`${APP_API_BASE}/groups/${groupId}`, updatedGroup.playlist_ids)
      .then(() => {
        updateRecoil();
        clearSelection(); // clears selection from dropdown
        // have to use locally compiled new group here because the recoil update doesn't trigger a re-render of the sync function in time.
        sync([updatedGroup]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ mt: 1, p: 0, display: "block" }}
      onClick={add}
    >
      <Typography variant="subtitle2">Add</Typography>
    </Button>
  );
};
