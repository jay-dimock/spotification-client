import "./App.css";
import React from "react";
import { PageWrapper } from "./components/PageWrapper.react";
import { Login } from "./components/Login.react";
import { About } from "./components/About.react";
import { Token } from "./components/Token.react";
import { Home } from "./components/Home.react";
import { SpotifyApiEffect } from "./components/SpotifyApiEffect.react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Router>
        {/* <SpotifyApiEffect /> */}
        <PageWrapper>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/token" element={<Token />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </PageWrapper>
      </Router>
    </div>
  );
};

export default App;
