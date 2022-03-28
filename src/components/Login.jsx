import { Cancel, Room } from "@material-ui/icons";
import React, { useState, useRef } from "react";
import axios from "axios";
import "./login.css";
const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const [error, setError] = useState(false);
  const nameRef = useRef();

  const passwordRef = useRef();

  //register
  const handleSubmit = async (e) => {
    //prevent default behaviour of form to refresh
    e.preventDefault();
    const user = {
      username: nameRef.current.value,

      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        user
      );
      myStorage.setItem("user", res.data.username);

      setCurrentUser(res.data.username);
      setError(false);
      setShowLogin(false);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />

        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginButton" type="submit">
          Login
        </button>

        {error && (
          <span className="failure"> Login Failed.Something went wrong!</span>
        )}
      </form>
      <Cancel className="registerCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
