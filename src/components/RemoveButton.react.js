import React from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useRecoilValue } from "recoil";
import { playlistsState, groupsState, syncingState } from "../recoil_state";
import { useSyncSpotifyGroupTracks } from "../services/useSyncSpotifyGroupTracks";
import { useUpdateGroup } from "../services/useUpdateGroup";
import { useUpdateRecoilGroup } from "../services/useUpdateRecoilGroup";

export const RemoveButton = (props) => {
  const { tooltip, groupId, playlistId } = props;
  const groups = useRecoilValue(groupsState);
  const playlists = useRecoilValue(playlistsState);
  const syncing = useRecoilValue(syncingState);
  const syncGroupTracks = useSyncSpotifyGroupTracks();
  const updateGroup = useUpdateGroup();
  const updateRecoilGroup = useUpdateRecoilGroup();

  const remove = async () => {
    const updatedPlaylistIdsForGroup = [...groups[groupId].playlist_ids].filter(
      (p) => p !== playlistId
    );
    const updatedGroup = await updateGroup(
      groups[groupId],
      updatedPlaylistIdsForGroup
    );
    if (!updatedGroup) {
      return;
    }
    const updatedGroupIdsForPlaylist = [
      ...playlists[playlistId].group_ids,
    ].filter((g) => g !== groupId);

    updateRecoilGroup(
      playlistId,
      groupId,
      updatedGroup,
      updatedGroupIdsForPlaylist
    );

    // have to use locally compiled new group here because the recoil update doesn't trigger a re-render of the sync function in time.
    syncGroupTracks([updatedGroup]);
  };

  if (syncing) {
    return null;
  }

  return (
    <Tooltip title={tooltip} placement="left">
      <IconButton size={"small"} onClick={remove}>
        <RemoveCircleOutline
          sx={{
            color: "black",
            fontSize: "small",
            "&:hover": { color: "red" },
          }}
        />
      </IconButton>
    </Tooltip>
  );
};
