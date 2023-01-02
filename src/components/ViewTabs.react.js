import React from "react";
import { Tab, Tabs } from "@mui/material";
import { useRecoilState } from "recoil";
import { viewState } from "../recoil_state";
import { MANAGE_PLAYLISTS, MANAGE_GROUPS } from "../constants/ViewConstants";

export const ViewTabs = () => {
  const [view, setView] = useRecoilState(viewState);

  const handleChange = (e, newValue) => {
    setView(newValue);
  };

  const tabsx = (value) => {
    const sx = {
      px: 2,
      mr: 1,
      borderRadius: "8px 8px 0 0",
      border: 1,
      borderBottom: 0,
    };
    if (value === view) {
      return { ...sx, bgcolor: "black" };
    }
    return sx;
  };

  return (
    <Tabs
      variant="scrollable"
      value={view}
      onChange={handleChange}
      aria-label="list view"
      width="100%"
      sx={{
        "& .MuiTabs-indicator": {
          display: "none",
        },
      }}
      scrollButtons
      allowScrollButtonsMobile
    >
      <Tab
        value={MANAGE_GROUPS}
        label="Group Playlists"
        sx={tabsx(MANAGE_GROUPS)}
        wrapped
      />
      <Tab
        value={MANAGE_PLAYLISTS}
        variant="contained"
        label="Individual Playlists"
        sx={tabsx(MANAGE_PLAYLISTS)}
        wrapped
      />
    </Tabs>
  );
};
