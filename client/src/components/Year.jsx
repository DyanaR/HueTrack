import React, { Fragment } from "react";
import styled from "styled-components";
import Day from "./Day";
import Stats from "./Stats";

export default function Year({ monthCount }) {
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Container>
      <div className="year">
        {monthCount.map(({ monthNames, month }, index) => {
          return (
            <div key={index}>
              <div className="month-title">{monthNames.format("MMMM")}</div>
              <div className="weekday">
                {daysOfWeek.map((day, idx) => (
                  <p key={idx} className="weekdays-txt">
                    {day}
                  </p>
                ))}
              </div>
              <div className="month">
                {month.map((row, i) => (
                  <Fragment key={i}>
                    {row.map((day, idx) => (
                      <Day day={day} key={idx} rowIdx={i} />
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="stats-container">
        <Stats />
      </div>
    </Container>
  );
}

const Container = styled.div`
  .year {
    display: grid;
    grid-template-columns: repeat(4, 0fr);
    justify-content: center;
    text-align: center;
    padding-top: 1rem;
    user-select: none;
  }
  .stats-container {
    ${"" /* visibility: hidden; */}
    display: none;
  }
  .month-title {
    padding-bottom: 0.5rem;
    text-align: left;
    padding-left: 1rem;
    font-weight: 600;
  }
  .month {
    padding: 0.3rem 1rem 1rem 1rem;
    display: grid;
    grid-template-columns: repeat(7, 0fr);
    justify-content: center;
  }
  .weekday {
    ${"" /* margin-top: 0; */}
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: center;
  }
  .date {
    color: var(--color-gray);
    font-size: 0.7rem;
  }
  .day-container {
    width: 1.3rem;
    height: 1.3rem;
    ${"" /* border: 0.05px solid #eeeeee; */}
    border: none;
  }
  .weekday {
    height: 0.5rem;
  }
  .weekdays-txt {
    color: var(--color-light);
    font-size: 0.7rem;
  }
  @media screen and (max-width: 1400px) {
    .date {
      font-size: 12px;
      ${"" /* font-weight: bold; */}
    }
  }
  @media screen and (max-width: 1110px) {
    .day-container {
      width: 1rem;
      height: 1rem;
    }
    .weekday {
      gap: 0.6rem;
    }
    .date {
      font-size: 10px;
      ${"" /* padding: 0; */}
    }
  }
  @media screen and (max-width: 1000px) {
    ${
      "" /* .year {
      grid-template-columns: repeat(3, 0fr);
    } */
    }
    .day-container {
      width: 1rem;
      height: 1rem;
      ${"" /* border: none; */}
    }
    .weekday {
      ${"" /* font-size: 7px; */}
    }
    .date {
      ${"" /* font-size: 7px; */}
      padding: 0;
    }
  }
  @media screen and (max-width: 920px) {
    .year {
      grid-template-columns: repeat(3, 0fr);
      column-gap: 2rem;
    }
    .day-container {
      width: 0.9rem;
      height: 0.9rem;
    }
    .weekday {
      gap: 0.5rem;
    }
    .month-title {
      font-size: 0.8rem;
    }
    .month {
      padding: 0.3rem 1rem 0.5rem 1rem;
    }
  }
  @media screen and (max-width: 800px) {
    .year {
      grid-template-columns: repeat(4, 0fr);
      column-gap: 0.1rem;
    }
    .stats-container {
      ${"" /* display: normal; */}
      display: flex;
      text-align: center;
      justify-content: center;
      background-color: var(--color-bg);
    }
    .day-container {
      width: 1.2rem;
      height: 1.2rem;
    }
    .weekday {
      gap: 0.85rem;
    }
  }

  @media screen and (max-width: 740px) {
    .year {
      column-gap: 0.8rem;
    }
    .day-container {
      width: 1rem;
      height: 1rem;
    }
    .weekday {
      gap: 0.65rem;
    }
  }
  @media screen and (max-width: 680px) {
    .year {
      column-gap: 0.02rem;
    }
    .day-container {
      width: 0.9rem;
      height: 0.9rem;
    }
    .weekday {
      gap: 0.5rem;
    }
  }

  @media screen and (max-width: 600px) {
    .year {
      grid-template-columns: repeat(3, 0fr);
      ${"" /* column-gap: .1rem; */}
    }
    .day-container {
      width: 1rem;
      height: 1rem;
    }
    .weekday {
      gap: 0.7rem;
    }
    .weekdays-txt {
      font-size: 0.6rem;
    }
    ${
      "" /* .month-title {
      font-size: 10px;
      padding-bottom: .4rem;
    } */
    }
    .month {
      padding-bottom: 0.5rem;
    }
  }
  @media screen and (max-width: 480px) {
    .year {
      column-gap: 0.1rem;
    }
    .day-container {
      width: 0.9rem;
      height: 0.9rem;
    }
  }

  @media screen and (max-width: 450px) {
    .year {
      column-gap: 0.02rem;
    }
    .weekday {
      gap: 0.45rem;
    }
    .day-container {
      width: 0.75rem;
      height: 0.75rem;
    }
    .date {
      font-size: 0.5rem;
    }
  }
`;
