import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import "./ImageUpload.css";
import { BASE_URL } from "./constants";

function ImageUpload({ authToken, authTokenType, userId }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  const handleUpload = (event) => {
    event?.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
      }),
      body: formData,
    };
    fetch(`${BASE_URL}/post/image`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        console.log(data);
        createPost(data.filename.substring(2));
        // create post here
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      })
      .finally(() => {
        setCaption("");
        setImage(null);
        document.getElementById("fileInput").value = "";
      });
  };
  const createPost = (imageUrl) => {
    const json_string = JSON.stringify({
      image_url: imageUrl,
      image_url_type: "relative",
      caption: caption,
      creator_id: userId,
    });
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
        "Content-Type": "application/json",
      }),
      body: json_string,
    };
    fetch(`${BASE_URL}/post`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        window.location.reload();
        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };
  return (
    <div className="imageUpload">
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={(event) => {
          setCaption(event.target.value);
        }}
      />
      <input type="file" id="fileInput" onChange={handleChange} />
      <Button className="imageUpload_button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
