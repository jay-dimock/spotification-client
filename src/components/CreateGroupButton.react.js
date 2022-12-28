import React from "react";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  playlistsState,
  groupsState,
  tokenInfoState,
  selectedGroupIdState,
} from "../recoil_state";
import { createGroupName } from "../util/groupNameConfig";
import { Box, Button, Container, Typography } from "@mui/material";

export const CreateGroupButton = (props) => {
  const { newGroupName, setNewGroupName, setInputErrorMessage, playlistId } =
    props;
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [, setSelectedGroupId] = useRecoilState(selectedGroupIdState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const playlistIds = playlistId ? [playlistId] : [];

  const updateRecoil = (groupId) => {
    if (!groupId) {
      throw new Error("Cannot update state: missing group ID");
    }
    if (playlistId) {
      const newGroupIds = [...playlists[playlistId].group_ids, groupId];
      const updatedPlaylist = {
        ...playlists[playlistId],
        group_ids: [...new Set(newGroupIds)],
      };
      const localPlaylists = { ...playlists };
      localPlaylists[playlistId] = updatedPlaylist;
      setPlaylists(localPlaylists);
    }

    const localGroups = { ...groups };

    if (!newGroupName) {
      throw new Error("Cannot update state: missing new group name.");
    }
    localGroups[groupId] = {
      spotify_id: groupId,
      name: newGroupName,
      full_name: createGroupName(newGroupName),
      playlist_ids: playlistIds,
    };

    setGroups(localGroups);
  };

  const addGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) {
      setInputErrorMessage("New group name cannot be blank");
      return;
    }
    const headers = {
      Authorization: "Bearer " + tokenInfo.access_token,
    };
    const payload = {
      name: createGroupName(trimmed),
      public: false,
      description:
        "This playlist was created on the Spotification " +
        "site by combining other playlists. To update/sync, connect to " +
        "playlistgroups.com. Don't add/remove tracks directly!",
    };
    axios
      .post(`${SPOTIFY_BASE}/playlists`, payload, { headers })
      .then((res) => {
        if (!res.data?.id) {
          console.log("No ID came back from Spotify", res.data);
          return;
        }
        console.log(res);
        const apiPayload = {
          spotifyId: res.data.id,
          userId: res.data.owner.id,
          spotifyPlaylistIds: playlistIds,
        };
        axios
          .post(`${API_BASE}/groups`, apiPayload)
          .then((res) => {
            console.log(res);
            updateRecoil(apiPayload.spotifyId);
            setSelectedGroupId("");
            setNewGroupName("");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 1, mt: 1, display: "block" }}
      onClick={addGroup}
    >
      <Typography variant="subtitle2">Save New Group</Typography>
    </Button>
  );
};
