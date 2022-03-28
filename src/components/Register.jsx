import { Cancel, Room } from "@material-ui/icons";
import React, { useState, useRef } from "react";
import axios from "axios";
import "./register.css";
const Register = ({ setShowRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  //register
  const handleSubmit = async (e) => {
    //prevent default behaviour of form to refresh
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post(
        "https://travelpinappmern.herokuapp.com/api/users/register",
        newUser
      );
      setSuccess(true);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        Travel Pin
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerButton" type="submit">
          {" "}
          Register
        </button>
        {success && (
          <span className="success"> Login Success.You can Login Now!</span>
        )}
        {error && (
          <span className="failure"> Login Failed.Something went wrong!</span>
        )}
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
