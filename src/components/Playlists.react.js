import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, playlistsState } from "../recoil_state";

import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

export const Playlists = () => {
  const user = useRecoilValue(userState);
  const playlists = useRecoilValue(playlistsState);
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 300,
        maxHeight: 360,
        bgcolor: "black",
        color: "white",
        overflow: "auto",
      }}
    >
      <List component="nav" aria-label="Playlists">
        {playlists.map((p) => (
          <ListItem key={p.id}>
            <ListItemText
              primary={p.name}
              secondary=<Typography
                color={"gainsboro"}
                variant="subtitle2"
                // sx={{ color: "gainsboro" }}
              >{`${p.total_tracks} tracks`}</Typography>
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
