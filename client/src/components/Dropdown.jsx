import React, { useContext, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import GlobalContext from "../context/GlobalContext";
import { NotificationManager } from "react-notifications";
import { colours } from "../utils/calendar.js";
import axios from "axios";

const Dropdown = ({ label }) => {
  // const { color } = props;
  const { setLabelObject, labelObject, calendarObject, setCalendarObject } =
    useContext(GlobalContext);
  const [expand, setExpand] = useState(false);
  const [previousColor, setPreviousColor] = useState(label.label_color);

  const handleColorChange = (newColor) => {
    const colorInUse = labelObject.some(
      (iterator) =>
        iterator.label_color === newColor && iterator.label_color !== ""
    );
    if (colorInUse) {
      NotificationManager.error("This color is already in use", "Failure");
      return;
    }

    // update the label's color in labelObject without affecting stats
    const updatedLabels = labelObject.map((iterator) => {
      if (label.label_id === iterator.label_id) iterator.label_color = newColor;
      return iterator;
    });
    setLabelObject(updatedLabels);

    // preapre data to send to backend
    const data = {
      label_id: label.label_id,
      habit_id: label.habit_id,
      label_color: newColor,
    };

    // PUT request to update label color in database
    axios
      .put("http://localhost/huetrack/updateLabel.php", data)
      .then((response) => {
        if (response.data.status === 1) {
          console.log("Label color updated successfully.");
        } else {
          console.error("Failed to update label color.");
        }
      })
      .catch((error) => {
        console.error("Error updating label color:", error);
      });

    // update calendarObject to reflect color change for all affected days
    const updatedCalendar = calendarObject.map((entry) => {
      if (entry.label_id === label.label_id) {
        return { ...entry, label_color: newColor }; // change the color for all entries with the previous color
      }
      return entry;
    });

    setCalendarObject(updatedCalendar);

    setPreviousColor(newColor); // track previous color
  };

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setExpand(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <Container>
      <div className="menu">
        <div className="dropdown" ref={menuRef}>
          <button
            className="dropdown"
            type="button"
            onClick={() => {
              setExpand(!expand);
            }}
            style={{
              backgroundColor: label?.label_color || "",
              height: "20px",
              width: "20px",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          ></button>
          <div
            onClick={() => {
              setExpand(!expand);
            }}
            className={"dropdown-menu " + (expand ? "active" : "inactive")}
          >
            <div className="colors">
              {colours.map((color, i) => (
                <span
                  key={i}
                  onClick={() => handleColorChange(color)}
                  style={{
                    backgroundColor: color,
                    height: "20px",
                    width: "20px",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    cursor: "pointer",
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dropdown;

const Container = styled.div`
  .menu {
    display: flex;
    align-items: center;
    ${"" /* gap: 1rem; */}
  }
  .colors {
    padding: 0.5rem 0;
    gap: 0.5rem;
    padding: 0.5rem 0;
    display: grid;
    grid-template-columns: repeat(5, 0fr);
  }
  .dropdown {
    border: none;
  }
  button {
    border: none;
    cursor: pointer;
    appearance: none;
  }
  .dropdown-menu {
    position: absolute;
    display: flex;
    ${"" /* gap: 1rem; */}
    padding: 0.2rem .7rem;
    background-color: var(--color-white);
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
  }
  .dropdown-menu.active {
    visibility: visible;
    display: grid;
    grid-template-columns: repeat(5, 0fr);
  }
  .dropdown-menu.inactive {
    visibility: hidden;
  }
  button,
  a {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
