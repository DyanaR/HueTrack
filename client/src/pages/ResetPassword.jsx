import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserAuth } from "../context/AuthContext";
import { FirebaseError } from "firebase/app";
import { handleEmailErrors } from "../context/EmailErrors";

const ResetPassword = () => {
  const { resetPassword, user } = UserAuth();

  const [email, setEmail] = useState("");
  const [errorEmailMessage, setErrorEmailMessage] = useState("");

  const handleSubmit = async (error) => {
    error.preventDefault();

    if (!email) {
      setErrorEmailMessage("Email address is required.");
    }

    try {
      await resetPassword(email);
      setErrorEmailMessage("");
      alert("A password reset email has been sent to your email address.");
    } catch (error) {
      console.log(error.message);
      if (error.code === "auth/invalid-email") {
        setErrorEmailMessage("Invalid email address.");
      } else if (error.code === "auth/user-not-found") {
        setErrorEmailMessage("No account found with this email.");
      } else {
        setErrorEmailMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <Container>
      <div>
        <div className="nav">
          <div>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h4>HueTrack</h4>
            </Link>
          </div>
          <div className="right">
            <Link
              to="/Login"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h6>Login</h6>
            </Link>

            <Link
              to="/Signup"
              style={{ textDecoration: "none", color: "black" }}
            >
              <h6>Try for free</h6>
            </Link>
          </div>
        </div>
        <div className="reset-container">
          <div className="words">
            <h3>Reset your Password</h3>
            <p style={{ paddingTop: "1rem" }}>
              Please provide the email address that you used when you signed up
              for your account.
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
            <div className="words">
              <p style={{ paddingBottom: "1rem", textAlign: "center" }}>
                We will send you an email that will allow you to reset your
                password.
              </p>
            </div>
            <button>
              <h6>Reset Password</h6>
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .reset-container {
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
  .email {
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
  button {
    width: 100%;
    height: 3rem;
  }
`;

export default ResetPassword;
