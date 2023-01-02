import { useCallback } from "react";
import axios from "axios";
import { API_BASE, SPOTIFY_BASE } from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import {
  userState,
  tokenInfoState,
  playlistsState,
  groupsState,
  syncingState,
} from "../recoil_state";

export const useSyncSpotify = () => {
  const [syncing, setSyncing] = useRecoilState(syncingState);
  const [tokenInfo, setTokenInfo] = useRecoilState(tokenInfoState);
  const [groups, setGroups] = useRecoilState(groupsState);

  return useCallback(async () => {
    setSyncing(true);
    if (!tokenInfo || !tokenInfo.access_token) {
      return;
    }
  }, [tokenInfo.access_token]);
};
