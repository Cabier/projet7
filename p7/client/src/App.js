import React, { useState } from "react";
//import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Upload from "./pages/Upload/Upload";
import Profile from "./pages/Profile/Profile";
import axios from "axios";
//ligne 26 origin login
const isConnected = localStorage.getItem("loggedIn");

function App() {
  const [loggedIn, setLogedIn] = useState(isConnected || false);
  axios.defaults.headers.common.authorization = `Bearer ${localStorage.token}`;

  return (
    <>
      <Router>
        <Navbar loggedIn={loggedIn} setLogedIn={setLogedIn} />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route
            path="/register"
            element={<Register setLogedIn={setLogedIn} />}
          />
          <Route
            path="/login"
            element={<Login loggedIn={loggedIn} setLogedIn={setLogedIn} />}
          />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
