import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import errorMessages from "../assets/firebaseErrorMessages.json";
import { NotificationManager } from "react-notifications";
import { handleEmailErrors } from "../context/EmailErrors";
import { FirebaseError } from "firebase/app";
import { handlePasswordErrors } from "../context/PasswordErrors";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");

  const { signIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (error) => {
    error.preventDefault();
    try {
      await signIn(email, password);
      navigate("/HueTrack");
    } catch (error) {
      console.log(error.message);
      if (error instanceof FirebaseError) {
        const emailErrorMessage = handleEmailErrors(error.code);
        const passwordErrorMessage = handlePasswordErrors(error.code);
        if (emailErrorMessage) {
          setErrorEmailMessage(emailErrorMessage);
        } else if (passwordErrorMessage) {
          setErrorPasswordMessage(passwordErrorMessage);
        }
      }
      // const userFriendlyMessage =
      //   errorMessages[e.code] ||
      //   "An unexpected error occurred. Please try again.";
      // NotificationManager.error(userFriendlyMessage, "Failure");
    }
  };

  return (
    <Container>
      <div className="nav">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h4>HueTrack</h4>
          </Link>
        </div>
        <div className="right">
          <Link to="/Login" style={{ textDecoration: "none", color: "black" }}>
            <h6>Login</h6>
          </Link>

          <Link to="/Signup" style={{ textDecoration: "none", color: "black" }}>
            <h6>Try for free</h6>
          </Link>
        </div>
      </div>

      <div className="signup-container">
        <div className="words">
          <h3>Log in to your Account</h3>
          <p style={{ paddingTop: "1rem" }}>
            Don't have an account? <Link to="/Signup">Sign up.</Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="email">
            <label>Email Address</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErrorEmailMessage("")}
              type="email"
            />
            {errorEmailMessage && (
              <div className="error-container">
                <p className="error-text">{errorEmailMessage}</p>
              </div>
            )}
          </div>
          <div className="password">
            <label>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setErrorPasswordMessage("")}
              type="password"
            />
            {errorPasswordMessage && (
              <div className="error-container">
                <p className="error-text">{errorPasswordMessage}</p>
              </div>
            )}
          </div>
          <p style={{ paddingBottom: ".5rem" }}>
            <Link to="/ResetPassword">Forgot Password?</Link>
          </p>
          <button>
            <h6>Login</h6>
          </button>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .signup-container {
    margin: 6rem 35rem;
  }
  h4 {
    color: var(--color-black);
    text-decoration: none;
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.3rem 10rem 0rem 10rem;
    background-color: var(--color-white);
  }
  .right {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  .words {
    text-align: center;
    padding: 2rem 1rem;
  }
  label {
    font-weight: bold;
  }
  input {
    margin: 0.5rem 0;
    padding-left: 1rem;
    border: none;
    height: 2.5rem;
    border-radius: 5px;
    ${"" /* background-color: var(--color-input); */}
    border: 1.5px solid #D7D7D7;
  }

  input:hover {
    border: 1.5px solid #1eacd6;
  }
  .email {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }
  .password {
    display: flex;
    flex-direction: column;
  }
  .error-container {
    margin-top: 0.5rem;
  }
  .error-text {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  button {
    width: 100%;
    height: 3rem;
  }
`;

export default Login;
