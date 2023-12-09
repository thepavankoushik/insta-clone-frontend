import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import React, { useState } from "react";
import Post from "./Post";
const BASE_URL = "http://localhost:8000";
function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/post/all`)
      .then((response) => {
        const json_r = response.json();
        console.log(json_r);
        if (response.ok) {
          return json_r;
        }
        throw response;
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }, []);
  return (
    <div className="app_posts">
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
}

export default App;
