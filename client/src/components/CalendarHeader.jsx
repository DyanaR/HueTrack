import React, { useContext } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdArrowDropDown } from "react-icons/md";
import GlobalContext from "../context/GlobalContext";
import dayjs from "dayjs";
import styled from "styled-components";

const CalendarHeader = () => {
  const {
    expand,
    setExpand,
    monthIndex,
    setMonthIndex,
    yearIndex,
    setYearIndex,
    view,
    setView,
  } = useContext(GlobalContext);

  const yearTitle = dayjs(new Date(yearIndex, monthIndex)).format("YYYY");
  const monthTitle = dayjs(new Date(yearIndex, monthIndex)).format("MMMM");

  return (
    <Container>
      <div className="heading">
        <div className="right-side">
          <button
            onClick={() => {
              setMonthIndex(dayjs().month());
              setYearIndex(dayjs().year());
            }}
          >
            Today
          </button>
          </div>
          <div className="middle">
          <div>
          <GrFormPrevious
            className="toggles"
            onClick={() => {
              {
                view
                  ? setMonthIndex(monthIndex - 1)
                  : setYearIndex(yearIndex - 1);
              }
            }}
          />
          </div>
          <div>
          {view ? (
            <h5 className="month-title">{monthTitle + ", " + yearTitle}</h5>
          ) : (
            <h5 className="year-title">{yearTitle}</h5>
          )}
          </div>
          <div>
          <GrFormNext
            className="toggles"
            onClick={() => {
              {
                view
                  ? setMonthIndex(monthIndex + 1)
                  : setYearIndex(yearIndex + 1);
              }
            }}
          />
          </div>
          </div>

          {/* <h3 className="date-title">{view ? monthTitle + " " + yearTitle : yearTitle}</h3> */}
        

        <div class="left-side">
          <button
            className="dropdown-btn"
            type="button"
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {view ? "Month" : "Year"}
            <MdArrowDropDown style={{ fontSize: "1.5rem" }} />
          </button>
          <ul
            onClick={() => {
              setExpand(!expand);
            }}
            className={"dropdown-menu " + (expand ? "active" : "inactive")}
          >
            <li>
              <a
                href="#"
                onClick={() => {
                  setView(true);
                }}
              >
                Month
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => {
                  setView(false);
                }}
              >
                Year
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default CalendarHeader;

const Container = styled.div`
  .heading {
    background-color: var(--color-bg);
    display: flex;
    justify-content: space-between;
    ${'' /* border-bottom: 2px solid var(--color-border); */}
    padding: 0.5rem 2rem;
    gap: 1rem;
    user-select: none;
  }
  .middle {
    display: flex;
    align-items: center;
    font-size: 1rem;
    gap: 1rem;
  }
  .toggles {
    cursor: pointer;
    font-size: 1.8rem;
  }
  .dropdown-btn {
    display: flex;
    align-items: center;
  }
  .dropdown-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem;
    background-color: var(--color-white);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  .dropdown-menu.active {
    visibility: visible;
  }
  .dropdown-menu.inactive {
    visibility: hidden;
  }
  button {
  background-color: var(--color-white);
  color: var(--color-black);
  border-radius: 0.1rem;
  cursor: pointer;
  border: 1.5px solid var(--color-black);
  transition: var(--transition);
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: flex;
  justify-content: center;
  height: auto;
  width: max-content;
  padding: 0.2rem 0.4rem;
  gap: 0.3rem;
}

  ${
    "" /* button {
    background-color: var(--color-white);
    width: max-content;
    display: inline-block;
    color: var(--color-text);
    padding: 0.4rem 0.6rem;
    border-radius: 0.2rem;
    cursor: pointer;
    border: 1px solid var(--color-text);
    transition: var(--transition);
  } */
  }
  a {
    color: var(--color-text);
    text-decoration: none;
    font-size: 0.8rem;
  }
  ul {
    list-style-type: none;
  }
  @media screen and (max-width: 950px){
    .month-title, .year-title{
      font-size: 1.3rem;
    }
  }
  @media screen and (max-width: 490px) {
    .month-title {
      font-size: 1.1rem;
    }
  }
  @media screen and (max-width: 460px) {
    .month-title {
      font-size: .9rem;
    }
    .toggles {
      font-size: 1.2rem;
    }
    .right-side {
      gap: 0.3rem;
    }
    .button {
      padding: 0.2rem 0.4rem;
    }
  }
  @media screen and (max-width: 410px) {
    .month-title {
      font-size: .8rem;
    }
  }
`;