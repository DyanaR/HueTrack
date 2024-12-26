import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import RightBoxes from "../components/RightBoxes";
import LeftBoxes from "../components/LeftBoxes";
import Cards from "../components/Cards";
import dayjs from "dayjs";

const Home = () => {
  const navigate = useNavigate();
  const { user } = UserAuth;
  const currentYear = dayjs().year();
  return (
    <Container>
      <div className="home">
        <div className="nav">
          <div className="left">
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

        <div className="boxes-container">
          <div>
            <LeftBoxes />
          </div>
          <div>
            <RightBoxes />
          </div>
        </div>
        <div className="home-container">
          <div className="motto">
            <h1>Daily Habits, Yearly Impact.</h1>
            <h1>See Your Progress In Color.</h1>
          </div>

          <div>
            <p className="tagline">
              Experience the power of visual accountability and turn daily
              actions into lasting habits effortlessly.
            </p>
          </div>

          <Link to={!user ? "/HueTrack" : "/Signup"}>
            <button>
              <h6 className="btn-txt">Try HueTrack</h6>
            </button>
          </Link>

          <div>
            <Cards />
          </div>

          <div className="year-info">
            <h2>Year-End Reflection</h2>
            <p className="year-txt">
              As the year concludes, treat yourself to a visual summary of your
              habit journey. View your final calendar—a colorful testament to
              your dedication and growth.
            </p>
            <div className="year-img"></div>
          </div>

          <div className="start-info">
            <h2>Start Today</h2>
            <p className="start-txt">
              As the year concludes, treat yourself to a visual summary of your
              habit journey. View your final calendar—a colorful testament to
              your dedication and growth.
            </p>
            <Link to={!user ? "/HueTrack" : "/Signup"}>
              <button>
                <h6 className="btn-txt">Try HueTrack</h6>
              </button>
            </Link>
          </div>
        </div>

        <div className="footer">
          <div className="footer-display">
            <div className="left">
              <h4>HueTrack</h4>
            </div>
            <div className="right">
              <h6 style={{ fontSize: "1rem" }}>Contact</h6>
              <h6 style={{ fontSize: "1rem" }}>Terms</h6>
              <h6 style={{ fontSize: "1rem" }}>Privacy Policy</h6>
            </div>
          </div>

          <p>{currentYear} @ HueTrack</p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .home {
    text-align: center;
    ${"" /* margin: 2rem; */}
    ${"" /* margin: 0; */}
  }
  .home-container {
    width: var(--container-width-lg);
    margin: 0 auto;
  }
  h4 {
    color: var(--color-black);
  }
  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem auto;
    width: var(--container-width-lg);
    ${"" /* padding: 2.3rem 10rem 0rem 10rem; */}
    background-color: var(--color-white);
  }
  .right {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
  .boxes-right {
    right: 0;
  }
  .boxes-left {
    left: 0;
  }
  .boxes {
    height: 8rem;
    width: 8rem;
    z-index: -1;
    position: absolute;
  }
  .motto {
    width: 90%;
    margin: 8rem auto 0 auto;
    ${
      "" /* padding: 0;
    padding-top: 8rem; */
    }
    ${"" /* padding: 8rem 15.75rem 0rem 15.75rem; */}
  }
  .tagline {
    color: var(--color-gray);
    ${"" /* padding: 2.5rem 21.7rem 5.81rem 21.7rem; */}
    ${"" /* width: var(--container-width-sm); */}
    ${"" /* width: 70%; */}
    margin: 2.5rem auto 5rem auto;
    font-size: 1.8rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    max-width: 50rem;
  }
  .btn-txt {
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .info-grid {
    justify-content: space-between;
    margin-top: 15rem;
    display: grid;
    grid-template-columns: repeat(4, 0fr);
    gap: 1rem;
  }
  h3 {
    padding-bottom: 0.62rem;
  }
  img {
    object-fit: fill;
  }
  .img-box {
    background-color: grey;
    width: 16.6rem;
    height: 16.6rem;
    margin-bottom: 2.8rem;
  }
  .year-info {
    margin-top: 10rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h2 {
    padding-bottom: 1.12rem;
  }
  .year-txt {
    margin-bottom: 2.5rem;
    max-width: 45rem;
    ${"" /* font-size: 1rem; */}
    font-style: normal;
    font-weight: 400;
    line-height: 170%;
  }
  .year-img {
    width: 70rem;
    height: 46rem;
    background-color: grey;
    display: block;
  }
  .start-info {
    padding: 10rem 0 1.12rem 0;
  }
  .start-txt {
    margin: 0 auto;
    margin-bottom: 5.5rem;
    max-width: 45rem;
  }
  .footer {
    background-color: var(--color-footer);
    height: 12.5rem;
    margin-top: 11rem;
    ${"" /* padding: 0rem 10rem 0 10rem; */}
  }
  .footer-display {
    width: var(--container-width-lg);
    margin: 0 auto;
    padding-top: 4rem;
    display: flex;
    justify-content: space-between;
  }
  @media screen and (max-width: 1390px) {
    h2 {
      font-size: 3rem;
    }
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
    }
    .info-grid {
      margin-top: 20rem;
    }
    .img-box {
      width: 14rem;
      height: 14rem;
    }
    .year-img {
      width: 55rem;
      height: 36rem;
    }
  }
  @media screen and (max-width: 1320px) {
    h1 {
      font-size: 4rem;
    }
    h2 {
      font-size: 2.8rem;
    }
    .tagline {
      font-size: 1.5rem;
      max-width: 45rem;
    }
   
  }
  @media screen and (max-width: 1190px) {
    .img-box {
      width: 12rem;
      height: 12rem;
    }
 
  }
  @media screen and (max-width: 1170px) {
    h1 {
      font-size: 3.8rem;
    }
    h2 {
      font-size: 2.5rem;
    }
    .tagline {
      font-size: 1.3rem;
      max-width: 40rem;
    }
    
    .year-img {
      width: 43rem;
      height: 30rem;
    }
  }
  @media screen and (max-width: 1110px) {
    h1 {
      font-size: 3.5rem;
    }
 
    .tagline {
      font-size: 1.2rem;
      max-width: 36rem;
    }

  }
  @media screen and (max-width: 1040px) {
    h1 {
      font-size: 3.2rem;
    }
    h2 {
      font-size: 2.2rem;
    }
    .year-img {
      width: 35rem;
      height: 25rem;
    }
    .img-box {
      width: 12rem;
      height: 12rem;
    }
    .info-grid{
      grid-template-columns: repeat(2, 0fr);

    }
    .info-box{
      width:20rem;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cards-txt{
      max-width: 20rem;
    }
    .tagline {
      margin-top: 2rem;
      margin-bottom: 4.5rem;
    }
  }
  @media screen and (max-width: 940px) {
    h1 {
      font-size: 2.8rem;
    }
    h2 {
      font-size: 2.2rem;
    }
    .tagline {
      font-size: 1.1rem;
      max-width: 30rem;
    }
    button {
      width: 9rem;
      height: 3rem;
    }
    .btn-txt{
      font-size: 1rem;
    }
  }

`;

export default Home;