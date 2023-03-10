import moment from "moment";

export function createTokenInfoObject(data, currentToken, currentRefreshToken) {
  if (!data || !data.access_token || data.access_token === currentToken) {
    return null;
  }
  if (!data.expires_in) {
    // this is very unlikely.
    console.log("token expiration date is missing", data);
    return null;
  }

  const expireDate = moment(new Date())
    .add(data.expires_in, "seconds")
    .toDate();

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token ?? currentRefreshToken,
    expires_at: expireDate,
  };
}
