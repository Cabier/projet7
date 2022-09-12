
import "./Navbar.scss";

import { useNavigate } from "react-router-dom";

function Navbar(props) {
 
  let navigate = useNavigate();

  
  return (
    <div className="Navbar">
      <img
        className="logo"
        src="../imgs/logo/icon-left-font-recadre.png"
        alt="Groupomania"
      />
      {localStorage.loggedIn ? (
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
