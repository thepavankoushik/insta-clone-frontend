import React, { useState, useEffect } from "react";
import "./Post.css";
import { Avatar, Button } from "@material-ui/core";
import { BASE_URL } from "./constants";
function Post({ post, authToken, authTokenType, username }) {
  const [imageUrl, setImageUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  useEffect(() => {
    if (post.image_url_type == "absolute") {
      setImageUrl(post.image_url);
    } else {
      setImageUrl(`${BASE_URL}/${post.image_url}`);
    }
  }, []);
  useEffect(() => {
    setComments(post.comments);
  }, []);
  const postComment = (event) => {
    event?.preventDefault();
    const json_string = JSON.stringify({
      username: username,
      text: newComment,
      post_id: post.id,
    });
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
        "Content-Type": "application/json",
      }),
      body: json_string,
    };

    fetch(`${BASE_URL}/comment/create`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        fetchComments();
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      })
      .finally(setNewComment(""));
  };
  const handleDelete = () => {
    const requestOptions = {
      method: "GET",
      headers: new Headers({
        Authorization: authTokenType + " " + authToken,
      }),
    };
    fetch(`${BASE_URL}/post/delete/${post.id}`, requestOptions)
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        }
        throw response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchComments = () => {
    fetch(`${BASE_URL}/comment/all/${post.id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log(data);
        setComments(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="post">
      <div className="post_header">
        <Avatar className="post_avatar" alt="PK" src="" />
        <div className="post_headerInfo">
          <h3>{post.user.username}</h3>
          <Button className="post_delete" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
      <img className="post_image" src={imageUrl} alt="post_image" />
      <h4 className="post_text">{post.caption}</h4>
      <div className="post_comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}:</strong>
            {comment.text}
          </p>
        ))}
      </div>
      {authToken && (
        <form className="post_commentbox">
          <input
            className="post_input"
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="post_button"
            type="submit"
            disabled={!newComment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
