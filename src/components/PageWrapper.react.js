import { Nav } from "./Nav.react.js";
import React from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
//import { black } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
  },
});

export const PageWrapper = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Nav />
      <div className="container-fluid">
        <div className="container-inner">{props.children}</div>
      </div>
    </ThemeProvider>
  );
};
