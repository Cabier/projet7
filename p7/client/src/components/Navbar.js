import React, { useState } from "react";
import "./Navbar.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar(props) {
  const [loggedIn, setLoggedIn] = useState(props.loggedIn);
  let navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(props.loggedIn);
  }, [props.loggedIn]);
  return (
    <div className="Navbar">
      <img
        className="logo"
        src="../imgs/logo/icon-left-font-recadre.png"
        alt="Groupomania"
      />
      {loggedIn ? (
        <>
          <a href="/">Home</a>
          <a href="/upload">Upload</a>
          <a href="/profile">Profile</a>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
          <button className="deconnexion"
            onClick={() => {
              props.setLogedIn(false);
              navigate("/login", { replace: true });
              localStorage.setItem("loggedIn", false);
              localStorage.clear()
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
          

        </>
      )}
    </div>
  );
}

export default Navbar;
