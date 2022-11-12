import "./App.css";
import { PageWrapper } from "./components/PageWrapper.react";
import { Login } from "./components/Login.react";
import { About } from "./components/About.react";
import { Token } from "./components/Token.react";
import { Home } from "./components/Home.react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <PageWrapper>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/token" element={<Token />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/about" element={<About />} />
          </Routes>
        </Router>
      </PageWrapper>
    </div>
  );
};

export default App;
