import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  userState,
  playlistsState,
  groupsState,
  viewState,
  selectedPlaylistIdState,
  selectedGroupIdState,
} from "../recoil_state";
import { MANAGE_PLAYLISTS } from "../constants/ViewConstants";
import {
  CustomAccordion,
  AccordionSummary,
  AccordionDetails,
} from "./Accordion.react";
import {
  Typography,
  Link,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { CustomBox } from "./CustomBox.react";

export const Groups = () => {
  const user = useRecoilValue(userState);
  const playlists = useRecoilValue(playlistsState);
  const groups = useRecoilValue(groupsState);
  const [, setView] = useRecoilState(viewState);
  const [, setSelectedPlaylistId] = useRecoilState(selectedPlaylistIdState);
  const [expandedGroupId, setExpandedGroupId] =
    useRecoilState(selectedGroupIdState);

  const handlePlaylistClicked = (event) => {
    setSelectedPlaylistId(event.target.value);
    setView(MANAGE_PLAYLISTS);
  };

  return (
    <div className="container-main">
      <Typography variant="h5" color="white" mb={1} mx={2}>
        Group Playlists
      </Typography>
      <CustomBox>
        {Object.values(groups).map((g) => (
          <CustomAccordion
            key={g.spotify_id}
            id={g.spotify_id}
            expandedId={expandedGroupId}
            setExpandedId={setExpandedGroupId}
          >
            <AccordionSummary>
              <Typography
                pl={1}
                fontWeight={
                  expandedGroupId === g.spotify_id ? "bold" : "normal"
                }
              >
                {g.name}
              </Typography>
              <ListItemButton
                autoFocus={expandedGroupId === g.spotify_id}
              ></ListItemButton>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" paddingBottom={1}>
                Individual Playlists:
                <List sx={{ paddingY: 0 }}>
                  {g.playlist_ids.map((playlistId) => (
                    <ListItem
                      key={playlistId}
                      sx={{ paddingY: 0 }}
                      onClick={handlePlaylistClicked}
                    >
                      <Link
                        variant="subtitle2"
                        component="button"
                        value={playlistId}
                        onClick={handlePlaylistClicked}
                      >
                        {playlists[playlistId].name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Typography>
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </CustomBox>
    </div>
  );
};
