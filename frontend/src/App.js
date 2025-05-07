import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import AuthService from "./services/auth.service";
import EventBus from "./common/EventBus";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import BoardUser from "./pages/BoardUser";
import BoardModerator from "./pages/BoardModerator";
import BoardAdmin from "./pages/BoardAdmin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  // Auth guard for protected routes
  const ProtectedRoute = ({ children, roles }) => {
    if (!currentUser) {
      // Not logged in, redirect to login
      return <Navigate to="/login" />;
    }

    // Check if route requires specific roles
    if (roles && !roles.some(role => currentUser.roles.includes(role))) {
      // User's role doesn't match any of the required roles
      return <Navigate to="/home" />;
    }

    return children;
  };

  return (
    <div style={{ backgroundColor: "#151515", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute roles={["ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"]}>
                <BoardUser />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mod" 
            element={
              <ProtectedRoute roles={["ROLE_MODERATOR", "ROLE_ADMIN"]}>
                <BoardModerator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={["ROLE_ADMIN"]}>
                <BoardAdmin />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
