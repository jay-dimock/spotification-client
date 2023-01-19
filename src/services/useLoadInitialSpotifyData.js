import axios from "axios";
import {
  SPOTIFY_ENDPOINT_USER,
  spotifyHeaders,
} from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import { useGetSpotifyGroupsAndPlaylists } from "./useGetSpotifyGroupsAndPlaylists";
import { useSyncSpotifyGroupTracks } from "./useSyncSpotifyGroupTracks";
import {
  userState,
  tokenInfoState,
  playlistsState,
  groupsState,
} from "../recoil_state";

export const useLoadInitialSpotifyData = () => {
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const [, setUser] = useRecoilState(userState);
  const [, setPlaylists] = useRecoilState(playlistsState);
  const [, setGroups] = useRecoilState(groupsState);
  const getSpotifyGroupsAndPlaylists = useGetSpotifyGroupsAndPlaylists();
  const syncGroupTracks = useSyncSpotifyGroupTracks();

  return async (newTokenInfo) => {
    if (
      !newTokenInfo ||
      !newTokenInfo.access_token ||
      newTokenInfo.access_token === tokenInfo.access_token
    ) {
      return false;
    }
    const headers = spotifyHeaders(newTokenInfo.access_token);

    const data = await axios
      .get(SPOTIFY_ENDPOINT_USER, { headers })
      .then((res) => res.data)
      .catch(console.error);

    if (!data?.id || !data?.display_name) {
      setUser(null);
      return false;
    }

    let imageUrl = null;
    if (data.images && data.images.length > 0) {
      imageUrl = data.images[0].url;
    }
    const user = {
      display_name: data.display_name,
      id: data.id,
      product: data.product,
      image_url: imageUrl,
    };

    setUser(user);
    setTokenInfo(newTokenInfo);

    const { groupsDict, playlistsDict } = await getSpotifyGroupsAndPlaylists(
      newTokenInfo,
      user.id
    );
    setPlaylists(playlistsDict);
    setGroups(groupsDict);

    await syncGroupTracks(Object.values(groupsDict), newTokenInfo);
  };
};
