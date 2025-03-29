import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login/Login.jsx";
import Map from "./pages/Map/Map.jsx";
import ReportDetails from "./pages/ReportDetails/ReportDetails.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Function to verify token
  const verifyToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setIsAuthenticated(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  // ✅ Check authentication on mount
  useEffect(() => {
    verifyToken();
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/report/:id"
          element={isAuthenticated ? <ReportDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/map"
          element={isAuthenticated ? <Map /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;




