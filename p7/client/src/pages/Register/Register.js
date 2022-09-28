import React, { useState } from "react";
import "./Register.scss";

import Axios from "axios";
import { useNavigate } from "react-router-dom";

function Register(props) {

  const [username, setUsername] = useState("");
  const [firstName, setfirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let navigate = useNavigate();

  const register = () => {

    Axios.post("http://localhost:5000/user/register", {
      username: username,
      firstName: firstName,
      email: email,
      password: password,
    }).then(() => {
      Axios.post("http://localhost:5000/user/login", {
        username: username,
        password: password,
      })
        .then((response) => {
          console.log(response.data);

          if (response.data.loggedIn) {
            localStorage.setItem("loggedIn", "true");
            props.setLogedIn(true);
            console.group(props);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("token", response.data.token);
            Axios.defaults.headers.common.authorization = `Bearer ${response.data.token}`;
            navigate("/home", { replace: true });
          }
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(err.response.data.message);
        });
    });
  };

  return (
    <div className="Register">
      <h1>Registration</h1>
      <div className="RegisterForm">
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => setUsername(event.target.value)}
          value={username}
        />
        <div className="Username error"></div>
        <input
          type="text"
          placeholder="firstName..."
          onChange={(event) => setfirstName(event.target.value)}
          value={firstName}
        />
        <div className="firstName error"></div>
        <input
          type="text"
          placeholder="email..."
          onChange={(event) => setEmail(event.target.value)}
          value={email}
        />
        <input
          type="password"
          placeholder="Password..."
          onChange={(event) => setPassword(event.target.value)}
          value={password}
        />
        <button className="registerButton" onClick={() => register()}>
          Register
        </button>
        <h1 style={{ color: "red" }}>{errorMessage} </h1>
      </div>
    </div>
  );
}

export default Register;
