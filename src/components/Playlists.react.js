import React, { useState } from "react";
//import { Navigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, playlistsState } from "../recoil_state";
import { People } from "@mui/icons-material";
import {
  CustomAccordion,
  AccordionSummary,
  AccordionDetails,
} from "./Accordion.react";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

export const Playlists = () => {
  const user = useRecoilValue(userState);
  const playlists = useRecoilValue(playlistsState);
  const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);

  return (
    <div className="container-main">
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Playlists
      </Typography>
      <Box
        borderColor="#28a745"
        sx={{
          width: "100%",
          maxWidth: 300,
          maxHeight: 400,
          backgroundColor: "white",
          color: "black",
          overflow: "auto",
          borderColor: "#28a745",
          borderWidth: "1px",
          borderRadius: "10px",
        }}
      >
        {playlists.map((p) => (
          <CustomAccordion
            key={p.id}
            id={p.id}
            expandedId={expandedPlaylistId}
            setExpandedId={setExpandedPlaylistId}
          >
            <AccordionSummary>
              {p.owner_id !== user.id && (
                <People sx={{ paddingLeft: 1, color: "black" }} />
              )}
              <Typography
                pl={1}
                fontWeight={expandedPlaylistId === p.id ? "bold" : "normal"}
              >
                {p.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2">{`${p.total_tracks} tracks`}</Typography>
              {p.owner_id !== user.id && (
                <div>
                  <Typography variant="subtitle2">
                    Owned by {p.owner_name}
                  </Typography>
                  <Typography variant="subtitle2">
                    <a href="#">Make it mine!</a>
                  </Typography>
                </div>
              )}
              <Typography variant="subtitle2">
                Belongs to 2 groups ( <a href="#">view / edit</a> )
              </Typography>
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </Box>
    </div>
  );
};
