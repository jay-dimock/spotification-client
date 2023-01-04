import { useCallback } from "react";
import axios from "axios";
import { APP_API_BASE } from "../constants/EnvConstants";
import { useRecoilState } from "recoil";
import { tokenInfoState } from "../recoil_state";
import { tokenIsExpired } from "../util/tokenIsExpired";
import { createTokenInfoObject } from "../util/createTokenInfoObject";

export const useGetRefreshedToken = () => {
  const [, setTokenInfo] = useRecoilState(tokenInfoState);

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
