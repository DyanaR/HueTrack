import React, { useContext, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { NotificationManager } from "react-notifications";
// import errorMessages from "../assets/firebaseErrorMessages.json";
import { FirebaseError } from "firebase/app";
import { handleEmailErrors } from "../context/EmailErrors";
import { handlePasswordErrors } from "../context/PasswordErrors";

const Signup = () => {
  const { userObject, setUserObject } = useContext(GlobalContext);
  const [validUsernameError, setValidtUsernameError] = useState("");
  const navigate = useNavigate();
  const { createUser } = UserAuth();
  const [errorUsernameMessage, setErrorUsernameMessage] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");
  const [errorPasswordMessage, setErrorPasswordMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserObject((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const validateUsername = (username) => {
    const regex = /^[a-zA-Z](?!.*__)[a-zA-Z0-9_]{2,28}[a-zA-Z0-9]$/;
    if (!regex.test(username)) {
      setValidtUsernameError(
        "Invalid username. Please follow the rules below:"
      );
    } else {
      setValidtUsernameError("");
    }
  };

  const handleBlur = (e) => {
    if (e.target.name === "username") {
      validateUsername(userObject.username);
    }
  };

  // set up error or success notifications for user to see
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validUsernameError) {
      return;
    }

    // check if the username already exists in the MySQL database
    const usernameCheckResponse = await fetch(
      "http://localhost/huetrack/checkUsername.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userObject.username }),
      }
    );

    if (!usernameCheckResponse.ok) {
      NotificationManager.error(
        "Error checking username availability. Please try again.",
        "Error"
      );
      return; // stop further processing
    }

    const usernameCheck = await usernameCheckResponse.json();

    if (usernameCheck.status === 0) {
      // if username already exists, show error notification
      setErrorUsernameMessage(usernameCheck.message);
      // NotificationManager.error(usernameCheck.message, "Error");
      return; // Stop the signup process
    }

    // now attempt to create the user in Firebase
    try {
      await createUser(
        userObject.email,
        userObject.password,
        userObject.username
      );
      navigate("/HueTrack"); // redirect to the HueTrack page
    } catch (error) {
      console.error("Signup error:", error);

      if (error instanceof FirebaseError) {
        const emailErrorMessage = handleEmailErrors(error.code);
        const passwordErrorMessage = handlePasswordErrors(error.code);
        // for email error messages to display in ui
        if (emailErrorMessage) {
          setErrorEmailMessage(emailErrorMessage);
          return;
        }
        // for password error messages
        else if (passwordErrorMessage) {
          setErrorPasswordMessage(passwordErrorMessage);
          return;
        }
        //generateFirebaseAuthErrorMessage(error);
      }
      // const userFriendlyMessage =
      //   errorMessages[error.code] ||
      //   "An unexpected error occurred. Please try again.";
      // NotificationManager.error(userFriendlyMessage, "Failure");
    }
  };

  return (
    <Container>
      <div className="nav">
        <div className="left">
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
          <h3>Create a New Account</h3>
          <p style={{ paddingTop: "1rem" }}>
            Already have an account? <Link to="/Login">Log in.</Link>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="username">
            <label>Username</label>
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="username"
              placeholder="Username"
              type="text"
            />
            {(validUsernameError || errorUsernameMessage) && (
              <div className="error-container">
                <p className="error-text">
                  {validUsernameError || errorUsernameMessage}
                </p>
                {validUsernameError && (
                  <ul className="error-list">
                    <li>Start with a letter</li>
                    <li>Be 4-30 characters long</li>
                    <li>
                      Contain only letters, digits, or a single underscore
                      between characters
                    </li>
                    <li>Not start or end with an underscore.</li>
                    <li>No spaces</li>
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="email">
            <label>Email Address</label>
            <input
              onChange={handleChange}
              onFocus={() => setErrorEmailMessage("")}
              name="email"
              placeholder="Email"
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
              onChange={handleChange}
              onFocus={() => setErrorPasswordMessage("")}
              name="password"
              placeholder="Password"
              type="password"
            />
            {errorPasswordMessage && (
              <div className="error-container">
                <p className="error-text">{errorPasswordMessage}</p>
              </div>
            )}
          </div>
          <button>
            <h6>Create Account</h6>
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
  .username {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }
  .email {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }
  .password {
    display: flex;
    flex-direction: column;
    padding-bottom: 1rem;
  }
  .error-container {
    margin-top: 0.5rem;
  }
  .error-text {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  .error-list {
    color: red;
    font-size: 0.875rem;
    list-style-type: disc;
    padding-left: 1.5rem;
  }
  button {
    width: 100%;
    height: 3rem;
  }
  ${
    "" /* button {
    background-color: var(--color-primary);
    width: 100%;
    display: inline-block;
    color: var(--color-bg);
    padding: 0.8rem 0;
    border-radius: 0.2rem;
    cursor: pointer;
    border: none;
    transition: var(--transition);
  }
  button:hover {
    background-color: #54a4ab;
  } */
  }
`;

export default Signup;
