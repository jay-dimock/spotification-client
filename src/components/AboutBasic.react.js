import { Typography } from "@mui/material";
import React from "react";

export const AboutBasic = () => {
  return (
    <div>
      <Typography>
        This site connects to your personal Spotify account and provides two
        features that Spotify does not:
      </Typography>
      <h4>Group your playlists</h4>
      <Typography>
        Combine related playlists together to make a "group playlist". For
        example, you might create a group called "Dance" which contains these
        playlists: Latin Dance, HipHop Dance, and Electronic Dance.
        Spotification will create a new playlist for you containing all tracks
        from all playlists in the group.
      </Typography>
      <h4>Copy a playlist</h4>
      <Typography>
        The "Copy" feature allows you to make a privately owned copy of a
        playlist you're following. You'll then be able to edit the new playlist
        as you wish, without affecting the original.
      </Typography>
    </div>
  );
};
