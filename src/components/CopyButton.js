import React from "react";
import {
  SPOTIFY_ENDPOINT_PLAYLISTS,
  spotifyHeaders,
} from "../constants/EnvConstants";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  playlistsState,
  tokenInfoState,
  selectedPlaylistIdState,
} from "../recoil_state";
import { Link, Tooltip } from "@mui/material";
import { useGetTracks } from "../services/useGetTracks";
import { useAddTracks } from "../services/useAddTracks";
import { useGetRefreshedToken } from "../services/useGetRefreshedToken";

export const CopyButton = (props) => {
  const tokenInfo = useRecoilValue(tokenInfoState);
  const [playlists, setPlaylists] = useRecoilState(playlistsState);
  const [, setSelectedPlaylistId] = useRecoilState(selectedPlaylistIdState);
  const getTracks = useGetTracks();
  const addTracks = useAddTracks();
  const getRefreshedToken = useGetRefreshedToken();
  const { playlist } = props;

  const copyPlaylist = async () => {
    const refreshedTokenInfo = await getRefreshedToken(tokenInfo);
    const headers = spotifyHeaders(refreshedTokenInfo.access_token);
    console.log(playlist);
    const payload = {
      name: playlist.name + " (my copy)",
      public: false,
    };

    const tracks = await getTracks(refreshedTokenInfo, playlist.spotify_id);

    const newPlaylist = await axios
      .post(SPOTIFY_ENDPOINT_PLAYLISTS, payload, {
        headers,
      })
      .then((res) => res.data)
      .catch(console.error);

    if (!newPlaylist.id) {
      return;
    }

    await addTracks(refreshedTokenInfo, newPlaylist.id, tracks);
    updateRecoil(newPlaylist, tracks.length);
  };

  const updateRecoil = (newPlaylist, trackCount) => {
    const playlistObject = {
      spotify_id: newPlaylist.id,
      name: newPlaylist.name,
      owner_name: newPlaylist.owner.display_name,
      owner_id: newPlaylist.owner.id,
      total_tracks: trackCount,
      group_ids: [],
    };
    const localPlaylists = { ...playlists };
    localPlaylists[playlistObject.spotify_id] = playlistObject;

    // alphabetize so new playlists shows in the correct place:
    const arr = Object.values(localPlaylists);
    arr.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));

    setPlaylists(Object.fromEntries(arr.map((p) => [p.spotify_id, p])));
    setSelectedPlaylistId(playlistObject.spotify_id);
  };

  return (
    <Tooltip title="Make a privately owned copy of this playlist that you can edit as you wish.">
      <Link variant="subtitle2" component="button" onClick={copyPlaylist}>
        copy
      </Link>
    </Tooltip>
  );
};
