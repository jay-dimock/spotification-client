import { useCallback, useState } from "react";
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

// const useSyncOne = () => {
//   return useCallback(async () => {

//   }, []);
// };

export const useSyncSpotify = () => {
  const [syncing, setSyncing] = useRecoilState(syncingState);
  const [groups, setGroups] = useRecoilState(groupsState);
  const getRefreshedToken = useGetRefreshedToken();
  const getTracks = useGetTracks();
  const tokenInfo = useRecoilValue(tokenInfoState);
  //const [currentTokenInfo, setCurrentTokenInfo] = useState(tokenInfo);

  return useCallback(
    async (groupId) => {
      setSyncing(true);
      const groupIds = groupId ? [groupId] : Object.keys(groups);
      let currentTokenInfo = tokenInfo;

      const syncGroup = async (gid) => {
        currentTokenInfo = await getRefreshedToken(currentTokenInfo);
        console.log("refreshed tokenInfo", currentTokenInfo);
        const playlistIds = groups[gid].playlist_ids;
        const trackIds = [];

        playlistIds.forEach(async (pid) => {
          console.log("pid", pid);
          const ids = await getTracks(currentTokenInfo, pid)
            .then((ids) => ids)
            .catch(console.error);

          console.log(ids);
          trackIds.push(...ids);
        });

        console.log(trackIds);
        const uniqueTrackIds = [...new Set(trackIds)];
        console.log("total unique tracks: ", uniqueTrackIds.length);
      };

      groupIds.forEach(async (gid) => await syncGroup(gid));

      setSyncing(false);
    },
    [groups, setSyncing, getTracks, getRefreshedToken, tokenInfo]
  );
};
