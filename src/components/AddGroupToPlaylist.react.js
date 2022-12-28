import React, { useState } from "react";
import { API_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  playlistsState,
  groupsState,
  tokenInfoState,
  selectedGroupIdState,
} from "../recoil_state";
import { CreateGroupInput } from "./CreateGroupInput.react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
} from "@mui/material";

export const AddGroupToPlaylist = (props) => {
  // const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);
  // const [newGroupName, setNewGroupName] = useState("");
  // const [inputErrorMessage, setInputErrorMessage] = useState("");
  // const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const handleGroupChange = (event) => {
    // if (event.target.value === "new") {
    //   setInputErrorMessage("");
    // }
    setSelectedGroupId(event.target.value);
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
      throw new Error(
        "Cannot update state: group is missing from state. Group ID = " +
          groupId
      );
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
        setSelectedGroupId(""); // clears selection from dropdown
      })
      .catch((err) => console.log(err));
  };

  const showAddButton = !!selectedGroupId && selectedGroupId !== "new";

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
        <CreateGroupInput
          sx={{ mt: 1.5, p: 0, width: "100%" }}
          playlistId={props.playlistId}
        />
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
