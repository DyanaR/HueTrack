import React, { useContext } from "react";
import styled from "styled-components";
import GlobalContext from "../context/GlobalContext";

const Stats = () => {
  const { calendarObject, labelObject, habitObject } =
    useContext(GlobalContext);

  function countByColorCode(colorCode) {
    if (!colorCode || colorCode === "") return 0; // skip white color
    return calendarObject.filter((entry) => entry.label_id === colorCode)
      .length;
  }
  return (
    <Container>
      <div className="stats">
        <h5 className="stats-title" style={{ marginBottom: ".81rem" }}>
          Stats
        </h5>
        <div className="info">
          {labelObject?.map((label, index) => (
            <div className="stats-info" key={index}>
              <h1 style={{ color: `${label?.label_color}` }} className="count">
                {countByColorCode(label?.label_id)}
              </h1>
              {<p className="color-title">{label?.label_title || ""}</p>}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Stats;

const Container = styled.div`
  .stats {
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
    padding-bottom: 10rem;
  }
  .stats-info {
    background-color: var(--color-input);
    width: 5rem;
    height: 5rem;
    border-radius: 0.3125rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .color-title {
    font-size: 1rem;
    display: none;
  }
  .info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  h2 {
    ${"" /* padding-top: 5rem; */}
    padding-bottom: 1rem;
  }
  p {
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  .count {
    font-size: 1.875rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  @media screen and (max-width: 800px) {
    .stats-title {
      font-size: 1.3rem;
    }
    .stats {
      padding-bottom: 2rem;
    }
    .color-title {
      display: block;
    }
  }
`;
