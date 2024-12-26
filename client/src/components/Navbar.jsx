import React, { useContext } from "react";
import GlobalContext from "../context/GlobalContext";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { UserAuth } from "../context/AuthContext";

const Navbar = () => {
  const { active, setActive } = useContext(GlobalContext);

  const {user} = UserAuth();

  const showMenu = () => {
    setActive(!active);
  };

  return (
    <Container>
      <div className="navbar">

        <div className="logo">
          <Link to="/" style={{textDecoration: 'none'}}>
            <h1>HueTrack</h1>
          </Link>
        </div>
    
        <div className={active ? "slider active" : "slider notActive"}>
          <div className="closed">
            <AiOutlineClose className="close" onClick={showMenu} />
          </div>
          {!user ? (
          <>
            <div className="login">
            <Link to="/Login"style={{textDecoration: 'none'}}>
              <h3>Log in</h3>
            </Link>
            </div>
            <div className="signup">
            <Link to="/Signup" style={{textDecoration: 'none'}}>
              <h3>Sign Up</h3>
            </Link>
          </div>
          </> )
          :
          (
          <div className="account">
            <Link to="/Account" style={{textDecoration: 'none', color: 'white', fontSize: '1.7rem'}}>
              <BsFillPersonFill />
            </Link>
          </div>
          )}
        </div>
        <div className="menu-icon">
          <GiHamburgerMenu className="menu" onClick={showMenu} />
        </div>
      </div>
      {/* </div> */}
      {/* </div> */}
    </Container>
  );
};

export default Navbar;

const Container = styled.div`
  .navbar {
    background-color: var(--color-primary);
    color: var(--color-white);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 4rem;
    box-shadow: 0 2px 3px var(--color-shadow);
    ${"" /* margin-bottom: 1rem; */}
    ${"" /* border-bottom: 1.3px solid var(--color-shadow); */}
  }
  .logo{
    ${'' /* padding-left: 10rem;
    padding-right: 20rem; */}
  }
  h1,h3{
    color: white;
  }
  h3{
    font-size: 1.5rem;
  }
  .notActive{    
    display: flex;
    gap: 1rem;
  }
  ${
    "" /* .navbar-right {
    display: flex;
    gap: 2rem;
  } */
  }

  ${'' /* .slider .stats{
    display: none;
    padding: 0;
  } */}
   .menu-icon .menu{
    display: none;
    font-size: 2rem;
    cursor: pointer;
}
 .closed .close {
    display: none;
    cursor: pointer;
    font-size: 2rem;
}
  .navbar .icons{
    font-size: 1.5rem;
  }
  ${
    "" /* .slider .sidebar{
    position: static;
  } */
  }

  @media screen and (max-width: 800px){
  .slider{
    ${'' /* display:flex; */}
      padding: 2.8rem 0;
        position: fixed;
        min-width: 78%;
        height: 100vh;
        background-color: var(--color-secondary);
        top: 0;
        right: -100%;
        z-index: 3;
        transition: 1s ease;
  }
  .slider.active{
        height: 100vh;
        min-height: 100%;
        top: 0;
        right: 0;
        transition: 1s ease;
        :root{
          -webkit-filter: blur(1px);
        }
    }

  .slider .login{
        display: flex;
        flex-direction: column;
        padding: 2rem 0;
        align-items: center;
        gap: 1rem;
  }

  .menu-icon .menu{
    display: block;
  }
  .menu-icon{
      display: block;
      align-items: right;
  }
  .menu-icon .menu{
    bottom: 1rem;
      display: block;
      font-size: 2rem;
      cursor: pointer;
  }
  .closed{
      display: flex;
   padding-right: 2rem; 
      justify-content: end;
      
  }
  .closed .close {
      display: block;
      cursor: pointer;
      font-size: 2rem;
  }
  }
 
`;