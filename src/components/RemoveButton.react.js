import React from "react";
import { RemoveCircleOutline } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { APP_API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistsState, groupsState, syncingState } from "../recoil_state";
import { useSyncSpotify } from "../services/useSyncSpotify";

export const RemoveButton = (props) => {
  const { tooltip, groupId, playlistId } = props;
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const sync = useSyncSpotify();
  const syncing = useRecoilValue(syncingState);

  const getUpdatedGroup = () => {
    const updatedPlaylistIds = [...groups[groupId].playlist_ids].filter(
      (p) => p !== playlistId
    );
    return {
      ...groups[groupId],
      playlist_ids: [...new Set(updatedPlaylistIds)],
    };
  };

  const updateRecoil = () => {
    const updatedGroup = getUpdatedGroup();
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

  const remove = () => {
    if (!groupId || !playlistId) {
      console.error("groupId or playlistId is missing");
      return;
    }
    const updatedGroup = getUpdatedGroup();
    axios
      .put(`${APP_API_BASE}/groups/${groupId}`, updatedGroup.playlist_ids)
      .then((res) => {
        updateRecoil();
        // have to use locally compiled new group here because the recoil update doesn't trigger a re-render of the sync function soon enough.
        sync([updatedGroup]);
      })
      .catch((err) => console.log(err));
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
