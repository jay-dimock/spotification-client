import { useCallback } from "react";
import axios from "axios";
import { SPOTIFY_BASE } from "../constants/EnvConstants";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  userState,
  playlistsState,
  tokenInfoState,
  groupsState,
  syncingState,
} from "../recoil_state";
import { useGetRefreshedToken } from "./useGetRefreshedToken";
import { useGetTracks } from "./useGetTracks";

export const useSyncSpotify = () => {
  const [, setSyncing] = useRecoilState(syncingState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const getRefreshedToken = useGetRefreshedToken();
  const getTracks = useGetTracks();
  const tokenInfo = useRecoilValue(tokenInfoState);

  return useCallback(
    async (groupId) => {
      setSyncing(true);
      const groupIds = groupId ? [groupId] : Object.keys(groups);
      let currentTokenInfo = tokenInfo;

      const getCombinedTrackIds = async (gid) => {
        currentTokenInfo = await getRefreshedToken(currentTokenInfo);
        const playlistIds = groups[gid].playlist_ids;
        const trackIds = [];

        for (const pid of playlistIds) {
          console.log("pid", pid);
          const ids = await getTracks(currentTokenInfo, pid);
          trackIds.push(...ids);
        }
        const uniqueTrackIds = [...new Set(trackIds)];
        return uniqueTrackIds;
      };

      groupIds.forEach(async (gid) => {
        const combinedTracks = await getCombinedTrackIds(gid);
        console.log("combinedTracks length", combinedTracks.length);
      });

      setSyncing(false);
    },
    [groups, setSyncing, getTracks, getRefreshedToken, tokenInfo]
  );
};
