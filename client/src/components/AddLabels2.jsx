import React, { useContext, useState } from "react";
import styled from "styled-components";
import Labels from "./Labels";
import GlobalContext from "../context/GlobalContext";
import { IoClose } from "react-icons/io5";

const AddLabels = () => {
  const { active2, setActive2 } = useContext(GlobalContext);

  const showMenu = () => {
    setActive2(!active2);
  };

  return (
    <Container>
      <div className={active2 && "popup"}>
        {active2 && (
          <div className="habits">
            <div style={{ textAlign: "right" }} onClick={showMenu}>
              <IoClose style={{ fontSize: "2rem" }} />
            </div>
            <Labels />
          </div>
        )}
      </div>
    </Container>
  );
};

export default AddLabels;

const Container = styled.div`
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
    transition: ;
  }
  .add-labels {
    color: var(--color-secondary);
    visibility: visible;
  }
  .habits {
    position: fixed;

    padding: 2rem;
    background-color: var(--color-white);
    width: 20rem;
    height: 25rem;
    right: 40%;
    bottom: 25%;
    z-index: 1;
    border-radius: 15px;
    transition: height 1s, width 1s, opacity 0s;
  }

  .add-button {
    position: fixed;
    padding-top: 0.3rem;
    border-radius: 50px;
    border: 0.15rem solid var(--color-bg);
    width: 3rem;
    height: 3rem;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 1;
    cursor: pointer;
    background-color: var(--color-red);
    font-size: 1.4rem;
  }
  @media screen and (max-width: 1350px) {
    .habits {
      right: 29%;
      bottom: 25%;
    }
  }
`;
