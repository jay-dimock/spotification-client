import React, { useState } from "react";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import { playlistsState, groupsState, tokenInfoState } from "../recoil_state";

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
  TextField,
} from "@mui/material";

export const AddPlaylistToGroup = (props) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylistId(event.target.value);
  };

  const addPlaylist = (event) => {};

  return (
    <div width="100%">
      <FormControl sx={{ m: 0, mt: 1, p: 0, width: "100%" }} size="small">
        <InputLabel id="select-group-label" size="small">
          <Typography variant="subtitle2">Add individual playlist</Typography>
        </InputLabel>

        <Select
          labelId="select-playlist"
          id="select-playlist"
          value={selectedPlaylistId}
          label="Add individual playlist"
          onChange={handlePlaylistChange}
          sx={{ width: "100% - 10em" }}
        >
          <MenuItem value="">
            <Typography variant="subtitle2">
              <em>None</em>
            </Typography>
          </MenuItem>
          {Object.values(playlists).map((p) => (
            <MenuItem key={p.spotify_id} value={p.spotify_id}>
              <Typography variant="subtitle2">{p.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!!selectedPlaylistId && (
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 1, p: 0 }}
          onClick={addPlaylist}
        >
          <Typography variant="subtitle2">Add</Typography>
        </Button>
      )}
    </div>
  );
};
