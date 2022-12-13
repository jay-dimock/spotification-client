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
import { MANAGE_GROUPS } from "../constants/ViewConstants";
import { People, RemoveCircleOutline } from "@mui/icons-material";
import {
  CustomAccordion,
  AccordionSummary,
  AccordionDetails,
} from "./Accordion.react";
import { AddGroupToPlaylist } from "./AddGroupToPlaylist.react";
import { RemoveButton } from "./RemoveButton.react";
import { accordionPage } from "../styles";
import {
  Container,
  Typography,
  Link,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import { CustomBox } from "./CustomBox.react";

export const Playlists = () => {
  const user = useRecoilValue(userState);
  const playlists = useRecoilValue(playlistsState);
  const groups = useRecoilValue(groupsState);
  const [, setView] = useRecoilState(viewState);
  const [, setSelectedGroupId] = useRecoilState(selectedGroupIdState);
  const [expandedPlaylistId, setExpandedPlaylistId] = useRecoilState(
    selectedPlaylistIdState
  );

  const handleGroupClicked = (event) => {
    setSelectedGroupId(event.target.value);
    setView(MANAGE_GROUPS);
  };

  return (
    <Container maxWidth="md" sx={accordionPage}>
      <CustomBox
        header={
          <Typography variant="h6" color="white" mb={1} mx={2}>
            Individual Playlists
          </Typography>
        }
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
              <ListItemButton
                autoFocus={expandedPlaylistId === p.spotify_id}
              ></ListItemButton>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle2" paddingBottom={1}>
                {`${p.total_tracks} tracks`}
              </Typography>
              {p.owner_id !== user.id && (
                <Typography variant="subtitle2" paddingBottom={1}>
                  Owned by {p.owner_name}{" "}
                  <Link variant="subtitle2" component="button">
                    copy
                  </Link>
                </Typography>
              )}
              {p.group_ids.length === 0 ? (
                <Typography variant="subtitle2" paddingBottom={1}>
                  This playlist does not currently belong to any group
                  playlists.
                </Typography>
              ) : (
                <Typography variant="subtitle2" paddingBottom={1}>
                  Groups:
                  <List sx={{ paddingY: 0 }}>
                    {p.group_ids.map((groupId) => (
                      <ListItem key={groupId} sx={{ paddingY: 0 }}>
                        <RemoveButton
                          tooltip="remove group"
                          groupId={groupId}
                          playlistId={p.spotify_id}
                        />
                        <Link
                          variant="subtitle2"
                          component="button"
                          value={groupId}
                          onClick={handleGroupClicked}
                          sx={{ paddingLeft: 1 }}
                        >
                          {groups[groupId].name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Typography>
              )}

              <AddGroupToPlaylist playlistId={p.spotify_id} />
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </CustomBox>
    </Container>
  );
};
