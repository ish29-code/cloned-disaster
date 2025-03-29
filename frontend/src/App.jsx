import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";
import LandingPage from "./pages/LandingPage/LandingPage.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login/Login.jsx";
import Map from "./pages/Map/Map.jsx";
import ReportDetails from "./pages/ReportDetails/ReportDetails.jsx";
import Emergency from './pages/Emergency/Emergency';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    // Call backend logout endpoint to clear the cookie
    fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(console.error);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
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
        <Route path="/emergency" element={<Emergency />} />
      </Routes>
    </Router>
  );
}

export default App;




