import "./App.css";
import React from "react";
import { Nav } from "./components/Nav.react";
import { Token } from "./components/Token.react";
import { Home } from "./components/Home.react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#28a745" },
    secondary: { main: "#000000" },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/token" element={<Token />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
