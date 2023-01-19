import React from "react";
import { useRecoilValue } from "recoil";
import { playlistsState, groupsState, syncingState } from "../recoil_state";
import { Typography, Button, CircularProgress } from "@mui/material";
import { useSyncSpotifyGroupTracks } from "../services/useSyncSpotifyGroupTracks";
import { useUpdateGroup } from "../services/useUpdateGroup";
import { useUpdateRecoilGroup } from "../services/useUpdateRecoilGroup";

export const AddButton = (props) => {
  const { groupId, playlistId, clearSelection } = props;
  const groups = useRecoilValue(groupsState);
  const playlists = useRecoilValue(playlistsState);
  const syncing = useRecoilValue(syncingState);
  const syncGroupTracks = useSyncSpotifyGroupTracks();
  const updateGroup = useUpdateGroup();
  const updateRecoilGroup = useUpdateRecoilGroup();

  if (!playlists[playlistId] || !groups[groupId]) {
    return null;
  }

  const add = async () => {
    const updatedPlaylistIdsForGroup = [
      ...groups[groupId].playlist_ids,
      playlistId,
    ];
    const updatedGroup = await updateGroup(
      groups[groupId],
      updatedPlaylistIdsForGroup
    );
    if (!updatedGroup) {
      return;
    }
    const updatedGroupIdsForPlaylist = [
      ...playlists[playlistId].group_ids,
      groupId,
    ];
    updateRecoilGroup(
      playlistId,
      groupId,
      updatedGroup,
      updatedGroupIdsForPlaylist
    );
    clearSelection(); // clears selection from dropdown

    // have to use locally compiled new group here because the recoil update doesn't trigger a re-render of the sync function in time.
    syncGroupTracks([updatedGroup]);
  };

  const sx = { mt: 1, p: 0 };

  if (syncing) {
    return (
      <Button variant="outlined" size="small" sx={sx}>
        <CircularProgress
          color="primary"
          size={20}
          style={{ position: "absolute" }}
        />
        Syncing
      </Button>
    );
  }

  return (
    <Button variant="contained" size="small" sx={sx} onClick={add}>
      <Typography variant="subtitle2">Add</Typography>
    </Button>
  );
};
