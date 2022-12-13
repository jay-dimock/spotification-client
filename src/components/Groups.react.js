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
import { accordionPage } from "../styles";
import {
  Container,
  Typography,
  Link,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import { CustomBox } from "./CustomBox.react";
import { RemoveButton } from "./RemoveButton.react";

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
    <Container maxWidth="md" sx={accordionPage}>
      <CustomBox
        header={
          <Typography variant="h6" color="white" mb={1} mx={2}>
            Group Playlists
          </Typography>
        }
      >
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
              {g.playlist_ids.length === 0 ? (
                <Typography variant="subtitle2">
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
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </CustomBox>
    </Container>
  );
};
