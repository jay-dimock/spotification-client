import React, { useState } from "react";
import { DeleteForever } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenInfoState,
  playlistsState,
  groupsState,
  selectedGroupIdState,
  syncingState,
} from "../recoil_state";
import { useDeleteGroup } from "../services/useDeleteGroup";

export const DeleteGroupButton = (props) => {
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const group = groups[props.groupId];
  const [, setSelectedGroupId] = useRecoilState(selectedGroupIdState);
  const syncing = useRecoilValue(syncingState);
  const tokenInfo = useRecoilValue(tokenInfoState);
  const deleteGroup = useDeleteGroup();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const deleteGroupPlaylist = async () => {
    const deleted = await deleteGroup(tokenInfo, group?.spotify_id);
    if (deleted) {
      updateRecoil();
    }
  };

  const updateRecoil = () => {
    setSelectedGroupId("");
    const localPlaylists = { ...playlists };
    if (group.playlist_ids.length > 0) {
      group.playlist_ids.forEach((pid) => {
        const groupIds = [...localPlaylists[pid].group_ids];
        const index = groupIds.indexOf(group.spotify_id);
        groupIds.splice(index, 1);
        localPlaylists[pid] = {
          ...localPlaylists[pid],
          group_ids: groupIds,
        };
      });
      setPlaylists(localPlaylists);
    }
    const localGroups = { ...groups };
    delete localGroups[group.spotify_id];
    setGroups(localGroups);
  };

  if (syncing) {
    return null;
  }

  if (!showConfirmation) {
    return (
      <Tooltip title={"Delete group playlist: " + group.name}>
        <IconButton onClick={() => setShowConfirmation(true)}>
          <DeleteForever
            sx={{
              color: "black",
              "&:hover": { color: "red" },
            }}
          />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Box mb={2}>
      <Typography variant="subtitle2">
        Are you sure you want to delete this group playlist? Its individual
        playlists will NOT be deleted, but the group playlist WILL be removed
        from both Spotification and Spotify.
      </Typography>
      <Button
        variant="contained"
        size="small"
        sx={{ py: 0 }}
        onClick={deleteGroupPlaylist}
      >
        Delete
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{ ml: 1, py: 0 }}
        onClick={() => setShowConfirmation(false)}
      >
        Cancel
      </Button>
    </Box>
  );
};
