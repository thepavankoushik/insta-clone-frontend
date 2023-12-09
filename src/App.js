import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import React, { useState } from "react";
import Post from "./Post";
import { Button } from "@material-ui/core";
const BASE_URL = "http://localhost:8000";
function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
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
        const result = data.sort((a, b) => {
          const t_a = a.timestamp.split(/[-T:]/);
          const t_b = b.timestamp.split(/[-T:]/);
          const d_a = new Date(
            Date.UTC(t_a[0], t_a[1] - 1, t_a[2], t_a[3], t_a[4], t_a[5])
          );
          const d_b = new Date(
            Date.UTC(t_b[0], t_b[1] - 1, t_b[2], t_b[3], t_b[4], t_b[5])
          );
          return d_b - d_a;
        });
        return result;
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
    <div className="App">
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://i0.wp.com/www.pngall.com/wp-content/uploads/2016/04/Instagram-Free-Download-PNG.png"
          alt="Instagram"
        />
        <div>
          <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
        </div>
      </div>
      <div className="app_posts">
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
    </div>
  );
}

export default App;
