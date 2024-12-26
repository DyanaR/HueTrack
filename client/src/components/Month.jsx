import React, { Fragment } from "react";
import styled from "styled-components";
import Day from "./Day";
import Stats from "./Stats";

export default function Month({ month }) {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const displayedMonth = month[1][0];

  return (
    <Container>
      <div className="month">
        {daysOfWeek.map((day, idx) => (
          <p key={idx} className="weekday">
            {day}
          </p>
        ))}
        {month.map((row, i) => (
          <Fragment key={i}>
            {row.map((day, idx) => (
              <Day day={day} key={idx} rowIdx={i} displayedMonth={displayedMonth} />
            ))}
          </Fragment>
        ))}
      </div>
      <div className="stats-container">
        <Stats />
      </div>
    </Container>
  );
}

const Container = styled.div`
  .month {
    ${"" /* padding: 3rem; */}
    display: grid;
    grid-template-columns: repeat(7, 0fr);
    justify-content: center;
    padding-top: 2rem;
  }
  .stats-container {
    display: none;
  }
  .weekday {
    text-align: center;
    color: var(--color-light);
  }
  @media screen and (max-width: 950px) {
    .day-container {
      width: 4rem;
      height: 4rem;
    }
  }
  @media screen and (max-width: 800px) {
    .day-container {
      width: 5rem;
      height: 5rem;
    }
    .stats-container {
      display: flex;
      justify-content: center;
      background-color: var(--color-bg);
      text-align: center;
    }

    @media screen and (max-width: 650px) {
      .day-container {
        width: 4rem;
        height: 4rem;
      }
    }
  }
  @media screen and (max-width: 550px) {
    .day-container {
      width: 3.5rem;
      height: 3.5rem;
    }
    .date{
      font-size: 1.1rem;
    }
  }
  @media screen and (max-width: 490px) {
    .day-container {
      width: 3rem;
      height: 3rem;
    }
    .weekday{
      font-size: .8rem;
    }
    .date{
      font-size: 1rem;
    }
  }
  @media screen and (max-width: 410px) {
    .day-container {
      width: 2.8rem;
      height: 2.8rem;
    }
    .weekday{
      font-size: .8rem;
    }
    .date{
      font-size: 1rem;
    }
  }
`;