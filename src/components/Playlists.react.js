import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState, playlistsState, groupsState } from "../recoil_state";
import { People } from "@mui/icons-material";
import {
  CustomAccordion,
  AccordionSummary,
  AccordionDetails,
} from "./Accordion.react";
import { AddGroupToPlaylist } from "./AddGroupToPlaylist.react";
import { Box, Typography, Link, List, ListItem } from "@mui/material";

export const Playlists = () => {
  const user = useRecoilValue(userState);
  const playlists = useRecoilValue(playlistsState);
  //const sortedPlaylists = useRecoilValue(sortedPlaylistsState);
  const groups = useRecoilValue(groupsState);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

  //console.log(playlists);
  //console.log(Object.values(playlists));

  return (
    <div className="container-main">
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Playlists
      </Typography>
      <Box
        borderColor="#28a745"
        sx={{
          width: "100%",
          maxWidth: 400,
          maxHeight: 500,
          backgroundColor: "white",
          color: "black",
          overflow: "auto",
          borderColor: "#28a745",
          borderWidth: "1px",
          borderRadius: "10px",
        }}
      >
        {Object.values(playlists).map((p) => (
          <CustomAccordion
            key={p.spotify_id}
            id={p.spotify_id}
            expandedId={expandedPlaylistId}
            setExpandedId={setExpandedPlaylistId}
          >
            <AccordionSummary>
              {p.owner_id !== user.id && (
                <People sx={{ paddingLeft: 1, color: "black" }} />
              )}
              <Typography
                pl={1}
                fontWeight={
                  expandedPlaylistId === p.spotify_id ? "bold" : "normal"
                }
              >
                {p.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="subtitle2"
                paddingBottom={1}
              >{`${p.total_tracks} tracks`}</Typography>
              {p.owner_id !== user.id && (
                <Typography variant="subtitle2" paddingBottom={1}>
                  Owned by {p.owner_name} <Link variant="subtitle2">copy</Link>
                </Typography>
              )}
              <Typography variant="subtitle2" paddingBottom={1}>
                Groups:
                <List sx={{ paddingY: 0 }}>
                  <ListItem sx={{ paddingY: 0 }}></ListItem>
                </List>
              </Typography>
              <AddGroupToPlaylist playlistId={p.spotify_id} />
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </Box>
    </div>
  );
};
