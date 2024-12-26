import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Navigate} from "react-router-dom";

const Account = () => {

  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("You are logged out.");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <Container>
      <Navbar />
      <div className="account-container">
        <h1>Account</h1>
        <p>User Email: {user && user.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .account-container {
    padding: 4rem;
  }
`;

export default Account;