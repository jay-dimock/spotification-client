import React from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../recoil_state";
import { Avatar, Tooltip } from "@mui/material";

export const UserAvatar = (props) => {
  const user = useRecoilValue(userState);
  if (!user) {
    return null;
  }
  const isXS = props.sx?.display?.xs === "block";
  const avatar = (
    <Avatar alt={user.display_name} src={user.image_url} sx={props.sx} />
  );
  // Only show tooltip for xs screen size, because in that case, the
  // user's name is not displayed.
  return isXS ? (
    <Tooltip title={"Connected: " + user.display_name}>{avatar}</Tooltip>
  ) : (
    avatar
  );
};
