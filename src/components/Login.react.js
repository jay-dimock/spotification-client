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
import { PrivacyPolicy } from "./PrivacyPolicy.react";

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
          <PrivacyPolicy />
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
