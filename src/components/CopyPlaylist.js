import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import {
  playlistsState,
  unfollowPlaylistAfterCopyState,
} from "../recoil_state";
import { Button, Tooltip, Typography } from "@mui/material";
import { CopyForm } from "./CopyForm";
import { CopyButton } from "./CopyButton";

export const CopyPlaylist = (props) => {
  const playlists = useRecoilValue(playlistsState);
  const unfollowPlaylistAfterCopy = useRecoilValue(
    unfollowPlaylistAfterCopyState
  );
  const [showForm, setShowForm] = useState(false);
  const { playlist } = props;
  const defaultCopyName = playlist.name + " (my copy)";
  const [newPlaylistName, setNewPlaylistName] = useState(defaultCopyName);
  const [inputErrorMessage, setInputErrorMessage] = useState("");

  const handleCancel = () => {
    setInputErrorMessage("");
    setNewPlaylistName(defaultCopyName);
    setShowForm(false);
  };

  const newPlaylistNameIsValid = () => {
    const newName = newPlaylistName.trim();
    if (newName.length === 0) {
      setInputErrorMessage("Please enter a name for the new playlist.");
      return false;
    }
    if (newName === playlist.name.trim()) {
      if (!unfollowPlaylistAfterCopy) {
        setInputErrorMessage(
          "New name must be diffrent from original name unless you choose to unfollow the original playlist."
        );
        return false;
      }
      return true;
    }
    const existing = Object.values(playlists).filter(
      (p) => p.name.trim() === newName
    );
    if (existing.length > 0) {
      setInputErrorMessage(
        "You already own or follow a playlist by this name."
      );
      return false;
    }
    return true;
  };

  if (!showForm) {
    return (
      <Tooltip title="Make a privately owned copy of this playlist that you can edit as you wish.">
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 1, py: 0 }}
          onClick={() => setShowForm(true)}
        >
          Make a copy
        </Button>
      </Tooltip>
    );
  }

  return (
    <>
      <Typography variant="subtitle2">
        A privately owned copy will be created for you.
      </Typography>
      <CopyForm
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        newPlaylistNameIsValid={newPlaylistNameIsValid}
        inputErrorMessage={inputErrorMessage}
        setInputErrorMessage={setInputErrorMessage}
      />
      <CopyButton
        playlist={playlist}
        newPlaylistName={newPlaylistName}
        newPlaylistNameIsValid={newPlaylistNameIsValid}
        setInputErrorMessage={setInputErrorMessage}
      />
      <Button
        variant="contained"
        size="small"
        sx={{ ml: 1, py: 0 }}
        onClick={handleCancel}
      >
        Cancel
      </Button>
    </>
  );
};
