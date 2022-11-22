import { Link } from "react-router-dom";

import React from "react";

export const About = () => {
  return (
    <div className="container-inner">
      <h3>Welcome to Spotification!</h3>
      <p>
        This site connects to your personal Spotify account and provides two
        features that Spotify does not:
      </p>
      <h4>Playlist Groups</h4>
      <p>
        Group related playlists together here on Spotification. You will then be
        able to play all tracks together for the group. For example, you might
        create a group called "Dance" which contains these playlists: Latin
        Dance, HipHop Dance, and Electronic Dance. When you play the Dance
        group, the player (on this site) will shuffle the tracks together from
        those playslists and play them for you.
      </p>
      <h4>Playlist Cloning</h4>
      <p>
        The "Make it Mine" feature allows you to make a privately owned copy of
        a playlist you're following. Once cloned, you can edit the new playlist
        as you wish. The original playlist will be unfollowed.
      </p>
      <button type="submit" className="btn btn-secondary" onClick={() => {}}>
        <Link to="/login">Continue</Link>
      </button>
    </div>
  );
};
