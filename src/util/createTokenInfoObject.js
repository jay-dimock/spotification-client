import moment from "moment";

export function createTokenInfoObject(data, currentToken, currentRefreshToken) {
  if (!data || !data.access_token || data.access_token === currentToken) {
    console.log("data", data);
    console.log("currentToken", currentToken);
    console.log("token is missing or unchanged", data);
    return null;
  }
  if (!data.expires_in) {
    // this is very unlikely.
    console.log("token expiration date is missing", data);
    return null;
  }

  console.log("creating tokenInfo object");

  const expireDate = moment(new Date())
    .add(30, "seconds") // set to a few seconds - FOR TESTING ONLY
    //.add(data.expires_in, "seconds")
    .toDate();

  return {
    access_token: data.access_token,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token ?? currentRefreshToken,
    expires_at: expireDate,
  };
}
