import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupsState, selectedGroupIdState } from "../recoil_state";
import { CreateGroupInput } from "./CreateGroupInput.react";
import { AddButton } from "./AddButton.react";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
} from "@mui/material";

export const AddGroupToPlaylist = (props) => {
  const [selectedGroupId, setSelectedGroupId] =
    useRecoilState(selectedGroupIdState);
  const groups = useRecoilValue(groupsState);

  const handleGroupChange = (event) => {
    setSelectedGroupId(event.target.value);
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
          value={groups[selectedGroupId] ? selectedGroupId : ""}
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
        <AddButton
          groupId={selectedGroupId}
          playlistId={props.playlistId}
          clearSelection={() => setSelectedGroupId("")}
        />
      )}
    </div>
  );
};
