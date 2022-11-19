import { Nav } from "./Nav.react.js";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#000000" },
    secondary: { main: "#d9d9d9" },
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
