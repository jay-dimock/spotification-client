import moment from "moment";

export function tokenIsExpired(expiresAt) {
  if (!expiresAt) {
    // there is no token, so it can't be expired
    return false;
  }
  const now = moment(new Date());
  const expires = moment(expiresAt);
  const tokenIsExpired = now.isAfter(expires);
  // if (!tokenIsExpired) {
  //   console.log("token is valid");
  // } else {
  //   console.log("token is expired");
  // }
  return tokenIsExpired;
}
