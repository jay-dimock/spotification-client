import "./App.css";
import React from "react";
import { PageWrapper } from "./components/PageWrapper.react";
import { Token } from "./components/Token.react";
import { Home } from "./components/Home.react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Router>
        <PageWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route exact path="/token" element={<Token />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </PageWrapper>
      </Router>
    </div>
  );
};

export default App;
