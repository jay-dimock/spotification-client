import React from "react";
import {
  APP_API_BASE,
  SPOTIFY_ENDPOINT_PLAYLISTS,
  spotifyHeaders,
} from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  playlistsState,
  groupsState,
  tokenInfoState,
  selectedGroupIdState,
} from "../recoil_state";
import { createGroupName } from "../util/groupNameConfig";
import { Button, Typography } from "@mui/material";
import { useGetRefreshedToken } from "../services/useGetRefreshedToken";
import { useSyncSpotifyGroupTracks } from "../services/useSyncSpotifyGroupTracks";

export const CreateGroupButton = (props) => {
  const { newGroupName, setNewGroupName, setInputErrorMessage, playlistId } =
    props;
  const tokenInfo = useRecoilValue(tokenInfoState);
  const getRefreshedToken = useGetRefreshedToken();
  const syncGroupTracks = useSyncSpotifyGroupTracks();
  const [groups, setGroups] = useRecoilState(groupsState);
  const [, setSelectedGroupId] = useRecoilState(selectedGroupIdState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const playlistIds = playlistId ? [playlistId] : [];

  const getNewGroupObject = (groupId) => {
    if (!groupId) {
      throw new Error("Missing group ID");
    }
    if (!newGroupName) {
      throw new Error("Missing new group name.");
    }
    return {
      spotify_id: groupId,
      name: newGroupName,
      full_name: createGroupName(newGroupName),
      playlist_ids: playlistIds,
    };
  };

  const updateRecoil = (groupId) => {
    if (playlistId) {
      const newGroupIds = [...playlists[playlistId].group_ids, groupId];
      const updatedPlaylist = {
        ...playlists[playlistId],
        group_ids: [...new Set(newGroupIds)],
      };
      const localPlaylists = { ...playlists };
      localPlaylists[playlistId] = updatedPlaylist;
      setPlaylists(localPlaylists);
    }
    const localGroups = { ...groups };
    localGroups[groupId] = getNewGroupObject(groupId);
    setGroups(localGroups);
  };

  const addGroup = async () => {
    const trimmed = newGroupName.trim();
    if (!trimmed) {
      setInputErrorMessage("New group name cannot be blank");
      return;
    }
    const existingNames = new Set(Object.values(groups).map((g) => g.name));
    if (existingNames.has(trimmed)) {
      setInputErrorMessage("A group already exists with this name.");
      return;
    }

    const refreshedTokenInfo = await getRefreshedToken(tokenInfo);
    const headers = spotifyHeaders(refreshedTokenInfo.access_token);
    const payload = {
      name: createGroupName(trimmed),
      public: false,
      description:
        "This playlist was created from the Spotification " +
        "site by combining other playlists. To update/sync, connect to " +
        "playlistgroups.com. Don't add/remove tracks directly: any changes " +
        "made directly in Spotify will be overwritten next time you " +
        "connect to Spotification.",
    };
    axios
      .post(SPOTIFY_ENDPOINT_PLAYLISTS, payload, { headers })
      .then((res) => {
        if (!res.data?.id) {
          console.log("No ID came back from Spotify", res.data);
          return;
        }
        console.log(res);
        const apiPayload = {
          spotifyId: res.data.id,
          userId: res.data.owner.id,
          spotifyPlaylistIds: playlistIds,
        };
        axios
          .post(`${APP_API_BASE}/groups`, apiPayload)
          .then(() => {
            if (playlistId) {
              const groupObject = getNewGroupObject(apiPayload.spotifyId);
              syncGroupTracks([groupObject], refreshedTokenInfo);
            }
            updateRecoil(apiPayload.spotifyId);
            setSelectedGroupId("");
            setNewGroupName("");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Button
      variant="contained"
      size="small"
      sx={{ mx: 1, mt: 1, display: "block" }}
      onClick={addGroup}
    >
      <Typography variant="subtitle2">Save New Group</Typography>
    </Button>
  );
};
