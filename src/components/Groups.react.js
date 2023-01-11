import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
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
import { accordionContent } from "../styles";
import {
  Box,
  Container,
  Typography,
  Link,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { RemoveButton } from "./RemoveButton.react";
import { AddPlaylistToGroup } from "./AddPlaylistToGroup.react";
import { CreateGroup } from "./CreateGroup.react";
import { ViewTabs } from "./ViewTabs.react";
import { DeleteGroupButton } from "./DeleteGroupButton";

export const Groups = () => {
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
    <Container maxWidth="sm" sx={{ padding: 0 }}>
      <ViewTabs />
      <Box sx={accordionContent}>
        <CreateGroup />
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
              <Typography variant="subtitle2">
                <b>Full name in Spotify: {g.full_name}</b>
                <DeleteGroupButton groupId={g.spotify_id} />
              </Typography>
              {g.playlist_ids.length === 0 ? (
                <Typography variant="subtitle2" paddingBottom={1}>
                  This group currently has no individual playlists.
                </Typography>
              ) : (
                <Typography variant="subtitle2" paddingBottom={1}>
                  Individual Playlists:
                  <List sx={{ paddingY: 0 }}>
                    {g.playlist_ids.map((playlistId) => (
                      <ListItem key={playlistId} sx={{ paddingY: 0 }}>
                        <RemoveButton
                          tooltip="remove playlist"
                          groupId={g.spotify_id}
                          playlistId={playlistId}
                        />
                        <Link
                          variant="subtitle2"
                          component="button"
                          value={playlistId}
                          onClick={handlePlaylistClicked}
                          sx={{ paddingLeft: 1 }}
                        >
                          {playlists[playlistId].name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Typography>
              )}
              <AddPlaylistToGroup groupId={g.spotify_id} />
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </Box>
    </Container>
  );
};
