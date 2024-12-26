import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AiOutlinePlus } from "react-icons/ai";
import { FaCheck } from "react-icons/fa6";
import Labels from "./Labels";
import GlobalContext from "../context/GlobalContext";

const AddLabels = () => {
  const { active, setActive } = useContext(GlobalContext);

  const showMenu = () => {
    setActive(!active);
  };

  return (
    <Container>
      <div className="add-labels">
        <button className="add-button" onClick={showMenu}>
          {active ? <FaCheck /> : <AiOutlinePlus className="plus" />}
        </button>
        {active && (
          <div className="habits">
            <Labels />
          </div>
        )}
      </div>
    </Container>
  );
};

export default AddLabels;

const Container = styled.div`
  .add-labels {
    ${"" /* color: var(--color-black); */}
    display: none;
  }
  .habits {
    position: fixed;
    padding: 2rem;
    background-color: var(--color-white);
    width: 15rem;
    height: 25rem;
    right: 4rem;
    bottom: 4rem;
    z-index: 1;
    border-radius: 15px;
    box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.2);
  }
  .plus {
    color: var(--color-white);
  }
  .add-button {
    position: fixed;
    padding-top: 0.3rem;
    border-radius: 50px;
    border: 0.15rem solid var(--color-black);
    width: 3rem;
    height: 3rem;
    right: 1.5rem;
    bottom: 1.5rem;
    z-index: 1;
    cursor: pointer;
    background-color: var(--color-black);
    font-size: 1.4rem;
  }
  .add-button:hover {
    background-color: var(--color-white);
    .plus {
      color: black;
    }
  }

  @media screen and (max-width: 800px) {
    .add-labels {
      display: block;
    }
  }
`;
