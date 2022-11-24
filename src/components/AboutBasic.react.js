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
        Group related playlists together here on Spotification. You will then be
        able to play all tracks together for the group. For example, you might
        create a group called "Dance" which contains these playlists: Latin
        Dance, HipHop Dance, and Electronic Dance. Spotification will create a
        new "group" playlist containing all tracks from all playlists in the
        group. You'll be able to access the group playlist on this site's music
        player as well as directly on Spotify.
      </Typography>
      <h4>Copy a playlist</h4>
      <Typography>
        The "Copy" feature allows you to make a privately owned copy of a
        playlist you're following. Once cloned, you can edit the new playlist as
        you wish.
      </Typography>
    </div>
  );
};
