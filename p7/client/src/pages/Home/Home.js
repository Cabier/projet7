import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faTrash,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import "./Home.scss";

function Home() {
  const [uploads, setUploads] = useState([]);
  const [user, setUser] = useState({});
  const [description, setDescription] = useState([]);

  const inputRef = useRef([]);

  useEffect(() => {
    getPosts();

    Axios.get("http://localhost:5000/user/profil")
      .then(({ data }) => {
        setUser(data);
      })
      .catch((err) => console.log("erreur", err));

    if (!localStorage.getItem("loggedIn")) {
      localStorage.setItem("loggedIn", false);
    }
  }, []);

  const getPosts = () => {
    Axios.get("http://localhost:5000/upload").then((response) => {
      setUploads(response.data.data);
      setDescription(response.data.data.map((val) => val.description));
    });
  };

  const likePost = (id, key) => {
    var tempLikes = uploads;
    tempLikes[key].likes = tempLikes[key].likes + 1;

    Axios.patch("http://localhost:5000/upload/like", {
      userLiking: localStorage.getItem("token"),
      postId: id,
    }).then((res) => {
      setUploads(tempLikes);
      getPosts();
    });
  };

  const deletePost = async (id) => {
    try {
      const answer = window.confirm("Are you sure to delete post ?");
      if (!answer) return;
      const response = await Axios.delete(
        "http://localhost:5000/upload/delete/" + id
      );
      if (response.status === 200) document.location.reload();
    } catch (err) {
      throw err;
    }
  };

  const handleChangeDescription = (event, key) => {

    setDescription(
      description.map((val, index) => {
        if (key === index) return event.target.value;
        else return val;
      })
    );

  };

  const updateDescription = (event, key) => {
    Axios.put("http://localhost:5000/upload/modifyPost/" + uploads[key].id, {
      description: description[key],
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="Home">
      {uploads.map((val, key) => {
        const isAdmin = user.isAdmin || user.username === val.author;
        return (
          <div key={key} className="Post">
            <div className="Image">
              <div className="Content">
                <img
                  src={`${process.env.REACT_APP_API_URL}upload/Images?nameImg=${val.image}`}
                  alt=""
                />
                {isAdmin ? (
                  <FontAwesomeIcon
                    id
                    className="trash"
                    icon={faTrash}
                    onClick={() => deletePost(val.id)}
                  />
                ) : null}
              </div>
            </div>
            <div className="Content">
              <div className="title">{val.title}</div>
              <div className="date-creation">
                Posté par : {val.author} le :{" "}
                {moment(val.dateCreation).format("DD/MM/YYYY à h:mm:ss a")}
              </div>
              {isAdmin ? (
                <div className="edit__css">
                  <input
                    type="text"
                    key={key}
                    ref={(element) => (inputRef.current[key] = element)}
                    value={description[key]}
                    className="description__input"
                    placeholder="Description..."
                    onChange={(e) => handleChangeDescription(e, key)}
                    onBlur={(e) => updateDescription(e, key)}
                  />
                  <FontAwesomeIcon
                    className="trash__css"
                    icon={faPencil}
                    onClick={() => inputRef.current[key].focus()}
                  />
                </div>
              ) : (
                <div className="description">{val.description}</div>
              )}
            </div>
            <div className="Engagement">
              <FontAwesomeIcon
                id="likeButton"
                icon={faThumbsUp}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  likePost(val.id, key);
                }}
              />
              {val.likes}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
