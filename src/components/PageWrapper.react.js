import { Nav } from "./Nav.react.js";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#28a745" },
    secondary: { main: "#000000" },
  },
});

export const PageWrapper = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Nav />
      <div className="container-fluid">{props.children}</div>
    </ThemeProvider>
  );
};
