import React from "react";
import {
  SPOTIFY_ENDPOINT_PLAYLISTS,
  spotifyEndpointUnfollowPlaylist,
  spotifyHeaders,
} from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  playlistsState,
  groupsState,
  tokenInfoState,
  selectedPlaylistIdState,
  unfollowPlaylistAfterCopyState,
  addCopiedPlaylistToOriginalGroupsState,
} from "../recoil_state";
import { Button } from "@mui/material";
import { useGetTracks } from "../services/useGetTracks";
import { useAddTracks } from "../services/useAddTracks";
import { useGetRefreshedToken } from "../services/useGetRefreshedToken";
import { useUpdateGroup } from "../services/useUpdateGroup";
import { useSyncSpotifyGroupTracks } from "../services/useSyncSpotifyGroupTracks";

export const CopyButton = (props) => {
  const {
    playlist,
    newPlaylistName,
    newPlaylistNameIsValid,
    setInputErrorMessage,
  } = props;
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const [, setSelectedPlaylistId] = useRecoilState(selectedPlaylistIdState);
  const addCopiedPlaylistToOriginalGroups = useRecoilValue(
    addCopiedPlaylistToOriginalGroupsState
  );
  const unfollowPlaylistAfterCopy = useRecoilValue(
    unfollowPlaylistAfterCopyState
  );
  const getTracks = useGetTracks();
  const addTracks = useAddTracks();
  const updateGroup = useUpdateGroup();
  const syncGroupTracks = useSyncSpotifyGroupTracks();
  const getRefreshedToken = useGetRefreshedToken();

  const copyPlaylist = async () => {
    if (!newPlaylistNameIsValid()) {
      return;
    }
    const refreshedTokenInfo = await getRefreshedToken(tokenInfo);
    const headers = spotifyHeaders(refreshedTokenInfo.access_token);
    const payload = {
      name: newPlaylistName,
      public: false,
      description:
        "This playlist was created from the Spotification site. " +
        `It\'s a privately owned copy of \"${playlist.name}\" by ${playlist.owner_name}.`,
    };

    const newPlaylist = await axios
      .post(SPOTIFY_ENDPOINT_PLAYLISTS, payload, {
        headers,
      })
      .then((res) => res.data)
      .catch(console.error);

    if (!newPlaylist.id) {
      setInputErrorMessage(
        "Something went wrong with the Spotify transaction. Please try again or come back later."
      );
      return;
    }
    const tracks = await getTracks(refreshedTokenInfo, playlist.spotify_id);
    await addTracks(refreshedTokenInfo, newPlaylist.id, tracks);

    let unfollowSuccess = false;
    if (unfollowPlaylistAfterCopy) {
      const endpoint = spotifyEndpointUnfollowPlaylist(playlist.spotify_id);
      unfollowSuccess = await axios
        .delete(endpoint, { headers: headers })
        .then(() => true)
        .catch((err) => {
          console.error(err);
          return false;
        });
    }

    let updatedGroups = null;
    if (unfollowPlaylistAfterCopy || addCopiedPlaylistToOriginalGroups) {
      updatedGroups = await getUpdatedGroups(newPlaylist.id);
    }
    updateRecoil(newPlaylist, tracks.length, unfollowSuccess, updatedGroups);
    if (updatedGroups) {
      const groupsToSync = playlist.group_ids.map((gid) => updatedGroups[gid]);
      syncGroupTracks(groupsToSync);
    }
  };

  const getUpdatedGroups = async (newPlaylistId) => {
    const localGroups = { ...groups };
    for (const gid of playlist.group_ids) {
      const pids = [...localGroups[gid].playlist_ids];
      if (unfollowPlaylistAfterCopy) {
        const index = pids.indexOf(playlist.spotify_id);
        pids.splice(index, 1);
      }
      if (addCopiedPlaylistToOriginalGroups) {
        pids.push(newPlaylistId);
      }
      const updatedGroup = await updateGroup(localGroups[gid], pids);
      if (updatedGroup) {
        localGroups[gid] = updatedGroup;
      }
    }
    return localGroups;
  };

  const updateRecoil = (
    newPlaylist,
    trackCount,
    unfollowSuccess,
    updatedGroups
  ) => {
    const playlistObject = {
      spotify_id: newPlaylist.id,
      name: newPlaylist.name,
      owner_name: newPlaylist.owner.display_name,
      owner_id: newPlaylist.owner.id,
      total_tracks: trackCount,
      group_ids: addCopiedPlaylistToOriginalGroups ? playlist.group_ids : [],
    };
    const localPlaylists = { ...playlists };
    if (unfollowSuccess) {
      delete localPlaylists[playlist.spotify_id];
    }
    localPlaylists[playlistObject.spotify_id] = playlistObject;

    // alphabetize so new playlist shows in the correct place:
    const arr = Object.values(localPlaylists);
    arr.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

    setPlaylists(Object.fromEntries(arr.map((p) => [p.spotify_id, p])));
    setSelectedPlaylistId(playlistObject.spotify_id);

    if (updatedGroups) {
      setGroups(updatedGroups);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ py: 0 }}
      onClick={copyPlaylist}
    >
      Copy
    </Button>
  );
};
