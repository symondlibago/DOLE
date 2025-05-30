import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Tupad from "./pages/tupad";
import GIP from "./pages/gip";
import ADL from "./pages/adl";
import Implemented from "./pages/implemented";
import Members from "./pages/members";

const App = () => {
  return (
    <Router>
      <ForceRedirect />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/tupad" replace />} />
            <Route path="/tupad" element={<Tupad />} />
            <Route path="/gip" element={<GIP />} />
            <Route path="/implemented" element={<Implemented />} />
            <Route path="/members" element={<Members />} />
            <Route path="/adl" element={<ADL />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// Force redirect to "/members" on page load
const ForceRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/members", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

export default App;
