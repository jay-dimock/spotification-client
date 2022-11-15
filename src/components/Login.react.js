import React from "react";
import { API_BASE } from "../constants/EnvConstants";
import Button from "@mui/material/Button";

export const Login = () => {
  const endpoint = `${API_BASE}/auth/login`;
  return (
    <div className="login-form">
      <h1>Log In</h1>
      <p>
        You will be taken to a Spotify page to log in and agree to allow this
        site limited access to your account. We will NOT have any access to your
        Spotify password. If you allow access, here are some of the things we
        WILL be able to do:
      </p>
      <ul>
        <li>Get the names of all your playlists</li>
        <li>Get the a list of all tracks in your playlists</li>
        <li>Create new playlists for you</li>
        <li>Play a set of tracks for you</li>
      </ul>
      <p>
        You must grant all requested permissions in order to use this site
        properly.
      </p>
      <p>
        You must use a PAID Spotify account.{" "}
        <b>Free accounts won't work with this site.</b>
      </p>
      <Button>
        <a href={endpoint}>Let's do this!</a>
      </Button>
    </div>
  );
};
