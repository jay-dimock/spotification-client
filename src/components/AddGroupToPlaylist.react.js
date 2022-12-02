import React, { useState } from "react";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { tokenInfoState } from "../recoil_state";
import {
  Input,
  InputLabel,
  OutlinedInput,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export const AddGroupToPlaylist = () => {
  const [group, setGroup] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const tokenInfo = useRecoilValue(tokenInfoState);

  const handleGroupChange = (event) => {
    if (event.target.value === "new") {
      setNewGroupName("");
      setInputErrorMessage("");
    }
    setGroup(event.target.value);
  };

  const handleNewGroupChange = (event) => {
    setInputErrorMessage("");
    setNewGroupName(event.target.value);
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
    //const response = axios.post(`${API_BASE}/groups`)

    const headers = {
      Authorization: "Bearer " + tokenInfo.access_token,
    };

    const payload = {
      name: "Spotification Group ~ " + trimmed,
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
        const apiPayload = {
          spotifyId: res.data.id,
          userId: res.owner.id,
          spotifyPlaylistIds: [],
        };
        axios.post(`${API_BASE}/groups`);
      })
      .catch((err) => console.log(err));
  };

  const showAddButton = !group ? false : group !== "new" || newGroupName;

  return (
    <div width="100%">
      <FormControl sx={{ m: 0, p: 0, width: "100%" }} size="small">
        <InputLabel id="select-group-label" size="small">
          <Typography variant="subtitle2">Add to group</Typography>
        </InputLabel>
        <Select
          labelId="select-group"
          id="select-group"
          value={group}
          label="Add to group"
          onChange={handleGroupChange}
          sx={{ width: "100% - 5em" }}
        >
          <MenuItem value="">
            <Typography variant="subtitle2">
              <em>None</em>
            </Typography>
          </MenuItem>
          <MenuItem value={10}>
            <Typography variant="subtitle2">Ten</Typography>
          </MenuItem>
          <MenuItem value={20}>
            <Typography variant="subtitle2">Twenty</Typography>
          </MenuItem>
          <MenuItem value={30}>
            <Typography variant="subtitle2">Thirty</Typography>
          </MenuItem>
          <MenuItem value={"new"}>
            <Typography variant="subtitle2">[ new group ]</Typography>
          </MenuItem>
        </Select>
      </FormControl>
      {group === "new" && (
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
          onClick={addNewGroup}
        >
          <Typography variant="subtitle2">Add</Typography>
        </Button>
      )}
    </div>
  );
};
