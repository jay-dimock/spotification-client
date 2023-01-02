import React from "react";
import { API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistsState, groupsState, tokenInfoState } from "../recoil_state";
import { Typography, Button } from "@mui/material";

export const AddButton = (props) => {
  const { groupId, playlistId, clearSelection } = props;
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

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
      const newPlaylistIds = [...groups[groupId].playlist_ids, playlistId];
      const updatedGroup = {
        ...groups[groupId],
        playlist_ids: [...new Set(newPlaylistIds)],
      };
      localGroups[groupId] = updatedGroup;
    }
    setGroups(localGroups);
  };

  const add = () => {
    if (!groupId || !playlistId) {
      console.error("groupId or playlistId is missing");
      return;
    }
    const updatedPlayistIdsForGroup = [
      ...groups[groupId].playlist_ids,
      playlistId,
    ];
    axios
      .put(`${API_BASE}/groups/${groupId}`, updatedPlayistIdsForGroup)
      .then((res) => {
        console.log(res);
        updateRecoil();
        clearSelection(); // clears selection from dropdown
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
