import React from "react";
import { AboutBasic } from "./AboutBasic.react";
import { accordionContent } from "../styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { prefixAndDelimiter } from "../util/groupNameConfig";

export const FAQ = () => {
  return (
    <Container maxWidth="md" sx={{ padding: 0 }}>
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Frequently Asked Questions
      </Typography>
      <Box sx={accordionContent}>
        {content.map((c, i) => (
          <Accordion key={i}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{c.q}</Typography>
            </AccordionSummary>
            <AccordionDetails>{c.a}</AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

const content = [
  {
    q: "What is the purpose of this site?",
    a: <AboutBasic />,
  },
  {
    q: "What happens when I create a group?",
    a: (
      <>
        <Typography mb={1}>
          Creating a new group here will cause a new Spotify playlist to be
          created for you. The Spotify playlist will take your group name and
          prefix it with "{prefixAndDelimiter}" to make it easy to spot as a
          group playlist.
        </Typography>
        <Typography mb={1}>
          If you create a new group from inside the "Individual Playslists"
          view, all tracks from the selected individual playlist will be added
          to the new group playlist. You will immediately be able to see all
          this on the Spotify app/site.
        </Typography>
      </>
    ),
  },
  {
    q: "What happens when I add a playlist to an existing group?",
    a: (
      <Typography mb={1}>
        All playlists from the playlist being added will be added to the group
        playlist. If any of the tracks are already in the group playlist, they
        will not be added again. You will immediately be able to see the changes
        on the Spotify app/site.
      </Typography>
    ),
  },
  {
    q: "Will group playlists automatically update when I make changes to the individual playlists they contain?",
    a: (
      <Typography mb={1}>
        When you add or remove a track on an individual playlist on Spotify,
        that track will not instantly be added to the group playlist. To update
        the group playlist with individual changes, you'll need to connect to
        the Spotification website. Whenever you sign in here, this site will
        check for changes to individual playlists and update the associated
        group playlists accordingly.
      </Typography>
    ),
  },
  {
    q: "How do group playlists stay in sync with their individual playlists?",
    a: (
      <>
        <Typography mb={1}>
          Group playlists are synced under the following circumstances:
        </Typography>
        <ol>
          <li>
            <Typography mb={1}>
              Whenever you connect to spotify from here, Spotification checks
              for changes to individual playlists and updates the associated
              group playlists accordingly.
            </Typography>
          </li>
          <li>
            <Typography mb={1}>
              Whenever you add or remove a group's individual playlists, all of
              that group's tracks will automaticically be synced on Spotify.
            </Typography>
          </li>
          <li>
            <Typography mb={1}>
              When you click the "sync" button, all groups will be synced with
              their individual playlists without the need to disconnect and
              reconnect to Spotify.
            </Typography>
          </li>
        </ol>
      </>
    ),
  },
  {
    q: "Can I make a group that contains other groups?",
    a: (
      <Typography mb={1}>
        No. You can only add individual playlists to a group.
      </Typography>
    ),
  },
  {
    q: 'How does the "copy" feature work?',
    a: <Typography mb={1}>Stay tuned...</Typography>,
  },
];
