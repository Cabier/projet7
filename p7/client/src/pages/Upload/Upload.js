import React, { useState } from "react";
import "./Upload.scss";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  console.log("image***",image)
  let navigate = useNavigate();

  const upload = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);

    formData.append("description", description);
    formData.append("author", localStorage.getItem("username"));
    formData.append("image", image);
    formData.append("imageTitre", image.name);

    Axios.post(`${process.env.REACT_APP_API_URL}upload/`, formData)
      .then(() => {
        navigate("/home",{ replace: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <div className="Upload">
      <h1>Create a post</h1>
      <div className="UploadForm">
        <input
          type="text"
          placeholder="Title..."
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Description..."
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button className="btn-upload" onClick={upload}>Upload</button>
      </div>
    </div>
  );
}

export default Upload;
