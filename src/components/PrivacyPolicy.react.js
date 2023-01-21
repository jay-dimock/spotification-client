import React from "react";
import { Typography } from "@mui/material";

export const PrivacyPolicy = () => {
  return (
    <>
      <Typography variant="paragraph">
        By allowing this site to access to your Spotify data, here are some of
        the things we will be able to do:
      </Typography>
      <ul>
        <li>
          Access your Spotify name and email address. We will NOT have access to
          your Spotify passoword, ever!{" "}
        </li>
        <li>Access the names of all your playlists</li>
        <li>Access the a list of all tracks in your playlists</li>
        <li>Create a playlist for you</li>
        <li>
          Delete a playlist for you (you will always have a chance to confirm
          before this happens).
        </li>
      </ul>
      <Typography mb={1}>
        Although Spotify itself may request your password when authorizing a
        connection to Spotification, this site will NOT have access to your
        password, ever!
      </Typography>
      <Typography mb={1}>
        We take your privacy very seriously. We will never sell your information
        or share it with anyone. We will only use your email address if we need
        to send you important information about the Spotification site or your
        account. We will not store your email address or any other personally
        identifying information.
      </Typography>
      <Typography mb={1}>
        We store the bare minimum data required for this site to sync your group
        playlists with individual playlists. This data consists of:
      </Typography>
      <ul>
        <li>
          Spotify's internal IDs for group playlists you have created here
        </li>
        <li>
          Spotify's internal IDs for individuial playlists that belong to your
          groups
        </li>
        <li>Spotify's internal ID for you as a user</li>
      </ul>
    </>
  );
};
