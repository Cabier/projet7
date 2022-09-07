import React, { useEffect, useState } from "react";
import "./Home.scss";
import Axios from "axios";
//import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
  faThumbsUp,faTrash,
} from "@fortawesome/free-solid-svg-icons";

//respondtata c'est l'array qu'on return
//avec uploadmap je rends les uploads individuels
function Home() {
  const [uploads, setUploads] = useState([]);
  
  useEffect(() => {
    getPosts();
    if (!localStorage.getItem("loggedIn")) {
      localStorage.setItem("loggedIn", false);
    }
    
  }, []);

  const getPosts = () => {
    Axios.get('http://localhost:5000/upload').then((response) => {
      setUploads(response.data);
    });
  };

  const likePost = (id, key) => {
    var tempLikes = uploads;
    tempLikes[key].likes = tempLikes[key].likes + 1;

    Axios.patch('http://localhost:5000/upload/like', {
      userLiking: localStorage.getItem("token"),
      postId: id,
    }).then((res) => {
      setUploads(tempLikes);
      getPosts();
    });
  };
  const handleClick = () => {
    const deletePost = async () => {
      try {
        const answer =window.confirm('Are you sure to delete post ?')
        if(!answer) return
        const response = await Axios.delete(
          "http://localhost:5000/upload/delete"
        );
        if (response.status === 200) document.location.reload();
      } catch (err) {
        throw err;
      }
    };
    deletePost();
  };

  return (
    <div className="Home">
      {uploads.map((val, key) => {
        return (
          <div className="Post">
            <div className="Image">
              <div className="Content">
                <img
                  src={`${process.env.REACT_APP_API_URL}upload/Images?nameImg=${val.image}`}alt=""
                />
                <FontAwesomeIcon
              id className="trash"
              icon={faTrash} 
              onClick={handleClick}
                
              
              />
              </div>
            </div>
            <div className="Content">
              <div className="title">
                {val.title} / posté par :  {val.author}
              </div>
              <div className="description">{val.description}</div>
            </div>
            <div className="Engagement">
              <FontAwesomeIcon
                id="likeButton"
                icon={faThumbsUp}
                onClick={() => {likePost(val.id,key)
                
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
