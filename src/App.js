import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import React, { useState } from "react";
import Post from "./Post";
import { Button, Input, Modal, makeStyles } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
const BASE_URL = "http://localhost:8000";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper, // "#fff"
    position: "absolute",
    width: 400,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles(); // classes.paper

  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [modalStyle, setModalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailid, setEmailid] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setAuthToken(window.localStorage.getItem("authToken"));
    setAuthTokenType(window.localStorage.getItem("authTokenType"));
    setUserId(window.localStorage.getItem("userId"));
    setUsername(window.localStorage.getItem("username"));
  }, []);

  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem("authToken", authToken);
    }
    if (authTokenType) {
      window.localStorage.setItem("authTokenType", authTokenType);
    }
    if (userId) {
      window.localStorage.setItem("userId", userId);
    }
    if (username) {
      window.localStorage.setItem("username", username);
    }
  }, [authToken, authTokenType, userId]);
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

  const signUp = (event) => {
    event?.preventDefault();

    const json_string = JSON.stringify({
      username: username,
      email: emailid,
      password: password,
    });
    let formData = new FormData();
    formData.append("username", username);
    formData.append("email", emailid);
    formData.append("password", password);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: json_string,
    };
    fetch(`${BASE_URL}/user/`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw response;
        }
      })
      .then((data) => {
        console.log(data);
        signin();
        setOpenSignUp(false);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  const signin = (event) => {
    event?.preventDefault();
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const requestOptions = {
      method: "POST",
      body: formData,
    };
    fetch(`${BASE_URL}/login`, requestOptions)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        console.log(data);
        setAuthToken(data.access_token);
        setAuthTokenType(data.token_type);
        setUserId(data.user_id);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
    setOpenSignIn(false);
  };
  const signOut = (event) => {
    setAuthToken(null);
    setAuthTokenType(null);
    setUserId("");
    setUsername("");
    setPassword("");
    window.localStorage.removeItem("authToken");
    window.localStorage.removeItem("authTokenType");
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("username");
  };
  return (
    <div className="App">
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                className="app_headerImage"
                src="https://i0.wp.com/www.pngall.com/wp-content/uploads/2016/04/Instagram-Free-Download-PNG.png"
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signin}>
              Login
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signin">
            <center>
              <img
                className="app_headerImage"
                src="https://i0.wp.com/www.pngall.com/wp-content/uploads/2016/04/Instagram-Free-Download-PNG.png"
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="emailid"
              type="text"
              value={emailid}
              onChange={(e) => setEmailid(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              SignUp
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://i0.wp.com/www.pngall.com/wp-content/uploads/2016/04/Instagram-Free-Download-PNG.png"
          alt="Instagram"
        />
        {authToken ? (
          <Button onClick={() => signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      <div className="app_posts">
        {posts.map((post) => (
          <Post post={post} />
        ))}
      </div>
      {authToken ? (
        <ImageUpload
          authToken={authToken}
          authTokenType={authTokenType}
          userId={userId}
        ></ImageUpload>
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
    </div>
  );
}

export default App;
