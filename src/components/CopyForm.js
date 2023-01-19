import React from "react";
import { useRecoilState } from "recoil";
import {
  unfollowPlaylistAfterCopyState,
  addCopiedPlaylistToOriginalGroupsState,
} from "../recoil_state";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

export const CopyForm = (props) => {
  const {
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistNameIsValid,
    inputErrorMessage,
    setInputErrorMessage,
  } = props;
  const [
    addCopiedPlaylistToOriginalGroups,
    setAddCopiedPlaylistToOriginalGroups,
  ] = useRecoilState(addCopiedPlaylistToOriginalGroupsState);
  const [unfollowPlaylistAfterCopy, setUnfollowPlaylistAfterCopy] =
    useRecoilState(unfollowPlaylistAfterCopyState);

  const handleNewPlaylistNameChange = (event) => {
    setInputErrorMessage("");
    setNewPlaylistName(event.target.value);
  };

  const handleUnfollowClick = () => {
    setUnfollowPlaylistAfterCopy(!unfollowPlaylistAfterCopy);
    if (newPlaylistNameIsValid()) {
      setInputErrorMessage("");
    }
  };

  const handleAddCopyToGroups = () => {
    setAddCopiedPlaylistToOriginalGroups(!addCopiedPlaylistToOriginalGroups);
  };

  return (
    <FormControl sx={{ mt: 2, p: 0, width: "100%" }} size="small">
      <TextField
        id="playlist-copy-name"
        value={newPlaylistName}
        onChange={handleNewPlaylistNameChange}
        label=<Typography variant="subtitle2">
          Enter new playlist name
        </Typography>
        error={inputErrorMessage.length > 0}
        helperText={inputErrorMessage}
        size="small"
      />
      <FormControlLabel
        variant="subtitle2"
        label=<Typography variant="subtitle2">
          Unfollow the original (it will also be removed from any groups it
          belongs to).
        </Typography>
        control={
          <Checkbox
            size="small"
            checked={unfollowPlaylistAfterCopy}
            onClick={handleUnfollowClick}
          />
        }
      />
      <FormControlLabel
        variant="subtitle2"
        label=<Typography variant="subtitle2">
          Add your copy to any groups the original belongs to.
        </Typography>
        control={
          <Checkbox
            size="small"
            checked={addCopiedPlaylistToOriginalGroups}
            onClick={handleAddCopyToGroups}
          />
        }
      />
    </FormControl>
  );
};
