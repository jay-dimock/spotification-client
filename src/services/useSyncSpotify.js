import { useRecoilState, useRecoilValue } from "recoil";
import { tokenInfoState, syncingState } from "../recoil_state";
import { useGetRefreshedToken } from "./useGetRefreshedToken";
import { useGetTracks } from "./useGetTracks";
import { useAddTracks } from "./useAddTracks";
import { useRemoveTracks } from "./useRemoveTracks";

export const useSyncSpotify = () => {
  const [, setSyncing] = useRecoilState(syncingState);
  const recoilTokenInfo = useRecoilValue(tokenInfoState);
  const getRefreshedToken = useGetRefreshedToken();
  const getTracks = useGetTracks();
  const addTracks = useAddTracks();
  const removeTracks = useRemoveTracks();

  return async (groups, tokenInfo) => {
    setSyncing(true);
    let currentTokenInfo = tokenInfo ?? recoilTokenInfo;

    const getCombinedTrackUris = async (group) => {
      currentTokenInfo = await getRefreshedToken(currentTokenInfo);
      const trackUris = [];
      for (const pid of group.playlist_ids) {
        const ids = await getTracks(currentTokenInfo, pid);
        trackUris.push(...ids);
      }
      return trackUris;
    };

    for (const group of groups) {
      console.log("SYNCING GROUP: " + group.name);
      const combinedTracks = await getCombinedTrackUris(group);
      const uniqueCombinedTracks = new Set(combinedTracks);
      console.log("combinedTracks length", [...uniqueCombinedTracks].length);

      const groupTracks = await getTracks(currentTokenInfo, group.spotify_id);
      const uniqueGroupTracks = new Set(groupTracks);
      console.log("groupTracks length", [...uniqueGroupTracks].length);

      const tracksToAdd = [...uniqueCombinedTracks].filter(
        (t) => !uniqueGroupTracks.has(t)
      );
      console.log("tracksToAdd.length", tracksToAdd.length);

      const tracksToRemove = [...uniqueGroupTracks].filter(
        (t) => !uniqueCombinedTracks.has(t)
      );
      console.log("tracksToRemove.length", tracksToRemove.length);

      await addTracks(currentTokenInfo, group.spotify_id, tracksToAdd);
      await removeTracks(currentTokenInfo, group.spotify_id, tracksToRemove);
    }

    setSyncing(false);
  };
};
