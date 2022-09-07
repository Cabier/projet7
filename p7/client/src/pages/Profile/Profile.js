import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.scss";

function Profile() {
  const [yourUploads, setYourUploads] = useState([]);

  let navigate = useNavigate();
  useEffect(() => {
    Axios.get(
      `http://localhost:3000/upload/byUser/${localStorage.getItem("username")}`
    ).then((response) => {
      setYourUploads(response.data);
      
    });
  });
  const desactivateAccount = (id) => {
    const answer =window.confirm('Are you sure to delete account ?')
    if(!answer) return
    id=localStorage.getItem("username")
    Axios.delete(`http://localhost:5000/user/desactivateAccount/${id}`);

    localStorage.clear();

    navigate("/login", { replace: true });
  };

  return (
    <div className="Profile">
      <h1>{localStorage.getItem("username")}</h1>
      <button className="delete_account" onClick={desactivateAccount}>
        Désactiver le compte
      </button>
      {yourUploads.map((val, key) => {
        return (
          <div className="Post">
            <div className="Image">{val.image}</div>
            <div className="Content">
              <div className="title">
                {" "}
                {val.title} / by @{val.author}
              </div>
              <div className="description">{val.description}</div>
            </div>
            <div className="Engagement">{val.likes}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Profile;
