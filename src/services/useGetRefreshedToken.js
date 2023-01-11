import { useCallback } from "react";
import axios from "axios";
import { APP_API_BASE } from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import { tokenInfoState } from "../recoil_state";
import { createTokenInfoObject } from "../util/createTokenInfoObject";
import moment from "moment";

export const useGetRefreshedToken = () => {
  const [, setTokenInfo] = useRecoilState(tokenInfoState);

  const tokenIsExpired = (expiresAt) => {
    if (!expiresAt) {
      // there is no token, so it can't be expired
      return false;
    }
    const now = moment(new Date());
    const expires = moment(expiresAt);
    const isExpired = now.isAfter(expires);
    return isExpired;
  };

  return useCallback(
    async (tokenInfo) => {
      if (!tokenInfo || !tokenInfo.access_token) {
        return null;
      }
      if (!tokenIsExpired(tokenInfo.expires_at)) {
        return tokenInfo;
      }
      console.log("refreshing expired token");
      const endpoint = `${APP_API_BASE}/auth/refresh?refresh_token=${tokenInfo.refresh_token}`;
      const response = await axios
        .get(endpoint)
        .then((res) => {
          const newTokenInfo = createTokenInfoObject(
            res.data,
            tokenInfo.access_token,
            tokenInfo.refresh_token
          );
          if (newTokenInfo) {
            setTokenInfo(newTokenInfo);
            return newTokenInfo;
          }
          return tokenInfo;
        })
        .catch(console.error);
      return response;
    },
    [setTokenInfo]
  );
};
