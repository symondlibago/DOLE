import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Tupad from "./pages/tupad";
import GIP from "./pages/gip";
import ADL from "./pages/adl";
import Members from "./pages/members";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
          <Route path="/tupad" element={<Tupad />} />
        <Route path="/gip" element={<GIP />} />
        <Route path="/members" element={<Members />} />
        <Route path="/adl" element={<ADL />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
