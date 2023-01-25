import React, { useState, useRef, useEffect } from "react";
import { FormControl, TextField, Typography } from "@mui/material";
import { CreateGroupButton } from "./CreateGroupButton.react";

export const CreateGroupInput = (props) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleNewGroupChange = (event) => {
    setInputErrorMessage("");
    setNewGroupName(event.target.value);
    inputRef.current?.focus();
  };

  const showCreateButton = newGroupName.trim().length > 0;

  return (
    <div width="100%">
      {props.header && (
        <Typography ml={1} p={0} mb={0} fontWeight="bold">
          Create New Group
        </Typography>
      )}
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
          inputRef={inputRef}
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
