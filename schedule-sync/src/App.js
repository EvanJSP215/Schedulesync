import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing";
import Login from "./components/login";
import Register from "./components/register";
import Client from "./components/client";
import Admin from "./components/admin";
import Profile from "./components/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client/:storeId" element={<Client />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;