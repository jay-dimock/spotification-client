import React from "react";
import { useRecoilValue } from "recoil";
import { groupsState, syncingState } from "../recoil_state";
import { Button, CircularProgress } from "@mui/material";
import { useSyncSpotify } from "../services/useSyncSpotify";

export const SyncButton = () => {
  const syncing = useRecoilValue(syncingState);
  const groups = useRecoilValue(groupsState);
  const sync = useSyncSpotify();

  const syncClicked = () => {
    sync(Object.values(groups), null);
  };

  if (syncing) {
    return (
      <Button variant="outlined" size="small" sx={{ mx: 1, my: 1 }}>
        Syncing
        <CircularProgress
          color="primary"
          size={20}
          style={{ position: "absolute" }}
        />
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 1, my: 1 }}
      onClick={syncClicked}
    >
      Sync
    </Button>
  );
};
