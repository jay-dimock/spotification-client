import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistsState, selectedPlaylistIdState } from "../recoil_state";
import { AddButton } from "./AddButton.react";

import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";

export const AddPlaylistToGroup = (props) => {
  const [selectedPlaylistId, setSelectedPlaylistId] = useRecoilState(
    selectedPlaylistIdState
  );
  const playlists = useRecoilValue(playlistsState);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylistId(event.target.value);
  };

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
        <AddButton
          groupId={props.groupId}
          playlistId={selectedPlaylistId}
          clearSelection={() => setSelectedPlaylistId("")}
        />
      )}
    </div>
  );
};
