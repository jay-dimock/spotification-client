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

      const groupTracks = await getTracks(currentTokenInfo, group.spotify_id);
      const uniqueGroupTracks = new Set(groupTracks);

      const tracksToAdd = [...uniqueCombinedTracks].filter(
        (t) => !uniqueGroupTracks.has(t)
      );
      const tracksToRemove = [...uniqueGroupTracks].filter(
        (t) => !uniqueCombinedTracks.has(t)
      );

      await addTracks(currentTokenInfo, group.spotify_id, tracksToAdd);
      if (tracksToAdd.length > 0) {
        console.log(`tracks added: ${tracksToAdd.length}`);
      }
      await removeTracks(currentTokenInfo, group.spotify_id, tracksToRemove);
      if (tracksToRemove.length > 0) {
        console.log(`tracks removed: ${tracksToRemove.length}`);
      }
    }

    setSyncing(false);
  };
};
