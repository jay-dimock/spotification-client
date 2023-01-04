import React from "react";
import { APP_API_BASE } from "../constants/EnvConstants";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Login = () => {
  const endpoint = `${APP_API_BASE}/auth/login`;
  return (
    <div>
      <h2>Connect to Spotify</h2>
      <Typography>
        In order to use this site, you must agree to allow us limited access to
        your Spotify account. You will be taken to a Spotify page to log in and
        grant access.
      </Typography>
      <Accordion sx={{ maxWidth: 540 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="privacy-policy-content"
        >
          <Typography fontWeight="bold">
            How we will use your information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="paragraph">
            If you allow access, here are some of the things we will be able to
            do:
          </Typography>
          <ul>
            <li>Get the names of all your playlists</li>
            <li>Get the a list of all tracks in your playlists</li>
            <li>Create new playlists for you</li>
            <li>Play a set of tracks for you</li>
          </ul>
          <Typography variant="paragraph">
            We will never sell your information. We will only use your email
            address if we need to send you important information about the
            Spotification site or your account.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Typography mt={1}>
        You must use a PAID Spotify account.
        <b> Free accounts won't work with this site.</b>
      </Typography>
      <Button variant="contained" href={endpoint} sx={{ mt: 2 }}>
        <Typography>Connect to Spotify</Typography>
      </Button>
    </div>
  );
};
