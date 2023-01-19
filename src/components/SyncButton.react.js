import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupsState,
  playlistsState,
  syncingState,
  tokenInfoState,
  userState,
} from "../recoil_state";
import { Button, CircularProgress } from "@mui/material";
import { useGetRefreshedToken } from "../services/useGetRefreshedToken";
import { useGetSpotifyGroupsAndPlaylists } from "../services/useGetSpotifyGroupsAndPlaylists";
import { useSyncSpotifyGroupTracks } from "../services/useSyncSpotifyGroupTracks";

export const SyncButton = () => {
  const syncing = useRecoilValue(syncingState);
  const [, setPlaylists] = useRecoilState(playlistsState);
  const [, setGroups] = useRecoilState(groupsState);
  const recoilTokenInfo = useRecoilValue(tokenInfoState);
  const user = useRecoilValue(userState);
  const getRefreshedToken = useGetRefreshedToken();
  const getSpotifyGroupsAndPlaylists = useGetSpotifyGroupsAndPlaylists();
  const syncGroupTracks = useSyncSpotifyGroupTracks();

  const syncClicked = async () => {
    const newTokenInfo = await getRefreshedToken(recoilTokenInfo);
    const { groupsDict, playlistsDict } = await getSpotifyGroupsAndPlaylists(
      newTokenInfo,
      user.id
    );
    setPlaylists(playlistsDict);
    setGroups(groupsDict);
    syncGroupTracks(Object.values(groupsDict), null);
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
