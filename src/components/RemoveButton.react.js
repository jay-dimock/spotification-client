import React from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistsState, groupsState, tokenInfoState } from "../recoil_state";

export const RemoveButton = (props) => {
  const { tooltip, groupId, playlistId } = props;
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const remove = () => {
    if (!groupId || !playlistId) {
      console.error("groupId or playlistId is missing");
      return;
    }
    const updatedPlaylistIdsForGroup = [...groups[groupId].playlist_ids].filter(
      (p) => p !== playlistId
    );
    axios
      .put(`${API_BASE}/groups/${groupId}`, [...updatedPlaylistIdsForGroup])
      .then((res) => {
        console.log(res);
        updateRecoil();
      })
      .catch((err) => console.log(err));
  };

  const updateRecoil = () => {
    const updatedPlaylistIds = [...groups[groupId].playlist_ids].filter(
      (p) => p !== playlistId
    );
    const updatedGroup = {
      ...groups[groupId],
      playlist_ids: [...new Set(updatedPlaylistIds)],
    };
    const localGroups = { ...groups };
    localGroups[groupId] = updatedGroup;
    setGroups(localGroups);

    const updatedGroupIds = [...playlists[playlistId].group_ids].filter(
      (g) => g !== groupId
    );
    const updatedPlaylist = {
      ...playlists[playlistId],
      group_ids: [...updatedGroupIds],
    };
    const localPlaylists = { ...playlists };
    localPlaylists[playlistId] = updatedPlaylist;
    setPlaylists(localPlaylists);
  };

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
