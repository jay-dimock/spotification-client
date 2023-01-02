import React, { useState } from "react";
import { FormControl, TextField, Typography } from "@mui/material";
import { CreateGroupButton } from "./CreateGroupButton.react";

export const CreateGroupInput = (props) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  const handleNewGroupChange = (event) => {
    setInputErrorMessage("");
    setNewGroupName(event.target.value);
  };

  const showCreateButton = newGroupName.trim().length > 0;

  return (
    <div width="100%">
      <FormControl sx={props.sx} size="small">
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
      {showCreateButton && (
        <CreateGroupButton
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          setInputErrorMessage={setInputErrorMessage}
          playlistId={props.playlistId}
        />
      )}
    </div>
  );
};