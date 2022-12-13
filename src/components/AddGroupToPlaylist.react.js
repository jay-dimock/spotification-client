import React, { useState } from "react";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistsState, groupsState, tokenInfoState } from "../recoil_state";
import { createGroupName } from "../util/groupNameConfig";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export const AddGroupToPlaylist = (props) => {
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const handleGroupChange = (event) => {
    setNewGroupName("");
    if (event.target.value === "new") {
      setInputErrorMessage("");
    }
    setSelectedGroupId(event.target.value);
  };

  const handleNewGroupChange = (event) => {
    setInputErrorMessage("");
    setNewGroupName(event.target.value);
  };

  const updateRecoil = (groupId) => {
    if (!groupId) {
      throw new Error("Cannot update state: missing group ID");
    }
    const newGroupIds = [...playlists[props.playlistId].group_ids, groupId];
    const updatedPlaylist = {
      ...playlists[props.playlistId],
      group_ids: [...new Set(newGroupIds)],
    };
    const localPlaylists = { ...playlists };
    localPlaylists[props.playlistId] = updatedPlaylist;
    setPlaylists(localPlaylists);

    const localGroups = { ...groups };
    if (!localGroups[groupId]) {
      if (!newGroupName) {
        throw new Error("Cannot update state: missing new group name.");
      }
      localGroups[groupId] = {
        spotify_id: groupId,
        name: newGroupName,
        playlist_ids: [props.playlistId],
      };
    } else {
      const newPlaylistIds = [
        ...groups[groupId].playlist_ids,
        props.playlistId,
      ];
      const updatedGroup = {
        ...groups[groupId],
        playlist_ids: [...new Set(newPlaylistIds)],
      };
      localGroups[groupId] = updatedGroup;
    }
    setGroups(localGroups);
  };

  const addGroup = () => {
    if (selectedGroupId === "new") {
      addNewGroup();
      return;
    }
    // add playlist to existing group
    const updatedPlayistIdsForGroup = [
      ...groups[selectedGroupId].playlist_ids,
      props.playlistId,
    ];
    axios
      .put(`${API_BASE}/groups/${selectedGroupId}`, updatedPlayistIdsForGroup)
      .then((res) => {
        console.log(res);
        updateRecoil(selectedGroupId);
        setSelectedGroupId(""); // why?
      })
      .catch((err) => console.log(err));
  };

  const addNewGroup = () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) {
      setInputErrorMessage("New group name cannot be blank");
      return;
    }
    // todo: check no playlist exists with this name
    // todo: build a useCreateGroup hook and call it here
    // send in a callback to add this playlist to the group afterward

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
          spotifyPlaylistIds: [props.playlistId],
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

  const showAddButton = !selectedGroupId
    ? false
    : selectedGroupId !== "new" || newGroupName;

  return (
    <div width="100%">
      <FormControl sx={{ m: 0, p: 0, width: "100%" }} size="small">
        <InputLabel id="select-group-label" size="small">
          <Typography variant="subtitle2">Add to group</Typography>
        </InputLabel>
        <Select
          labelId="select-group"
          id="select-group"
          value={selectedGroupId}
          label="Add to group"
          onChange={handleGroupChange}
          sx={{ width: "100% - 5em" }}
        >
          <MenuItem value="">
            <Typography variant="subtitle2">
              <em>None</em>
            </Typography>
          </MenuItem>
          {Object.values(groups).map((g) => (
            <MenuItem key={g.spotify_id} value={g.spotify_id}>
              <Typography variant="subtitle2">{g.name}</Typography>
            </MenuItem>
          ))}
          <MenuItem value={"new"}>
            <Typography variant="subtitle2">[ new group ]</Typography>
          </MenuItem>
        </Select>
      </FormControl>
      {selectedGroupId === "new" && (
        <FormControl sx={{ mt: 1.5, p: 0, width: "100%" }} size="small">
          <TextField
            id="new-group-name"
            value={newGroupName}
            onChange={handleNewGroupChange}
            label=<Typography variant="subtitle2">
              Enter new group name
            </Typography>
            error={inputErrorMessage.length > 0}
            helperText={inputErrorMessage}
            size="small"
          />
        </FormControl>
      )}
      {showAddButton && (
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 1, display: "block" }}
          onClick={addGroup}
        >
          <Typography variant="subtitle2">Add</Typography>
        </Button>
      )}
    </div>
  );
};
