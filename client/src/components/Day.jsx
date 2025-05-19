import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import GlobalContext from "../context/GlobalContext";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function Day({ day, rowIdx, displayedMonth }) {
  const { calendarObject, setCalendarObject, labelObject, habitObject } =
    useContext(GlobalContext);

  useEffect(() => {
    // fetch calendar entries for a specific habit_id
    const habitId = habitObject[0]?.habit_id; // ensure habit_id is available
    if (habitId) {
      axios
        .get(`http://localhost/huetrack/manageCalendar.php?habit_id=${habitId}`)
        .then((response) => {
          if (response.data.status === 1) {
            setCalendarObject(response.data.data); // populate calendar data
          } else {
            console.error("Failed to fetch calendar entries.");
          }
        })
        .catch((error) =>
          console.error("Error fetching calendar entries:", error)
        );
    }
  }, [habitObject]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY") ? "today" : "";
  }

  // add a default white color to the calendar UI (this should not count as an actual color)
  const labelObjectWithWhite = [
    {
      label_id: "default-white", // placeholder ID for white
      label_color: "", // empty string represents no color
      label_name: "None", // Title for the None color
    },
    ...labelObject, // append the actual label colors
  ];

  function extractColorIndex(colorCode) {
    const currentIndex = labelObjectWithWhite.findIndex(
      (label) => label.label_id === colorCode
    );
    return { currentIndex, totalLength: labelObjectWithWhite.length };
  }

  // handle cycling through the colors when clicking on a day
  function handleColorUpdate(dateValue) {
    const currentEntry =
      calendarObject.find((entry) => entry.day_date === dateValue) || null;

    let selectedLabel;

    // if no labels are available, do nothing
    if (labelObject.length === 0) return;

    // if no current entry exists, start with the first actual color (skip white)
    if (!currentEntry) {
      selectedLabel = labelObjectWithWhite[1]; // start with the first actual color, skip "default-white"
    } else {
      // if the day already has a color, cycle to the next color
      const { currentIndex, totalLength } = extractColorIndex(
        currentEntry.label_id
      );
      let newIndex = (currentIndex + 1) % totalLength; // Cycle through labels
      selectedLabel = labelObjectWithWhite[newIndex];
    }

    // only update calendarObject if a label is selected (no blank label_id or default-white)
    if (
      selectedLabel.label_id !== "default-white" &&
      selectedLabel.label_id !== ""
    ) {
      const newCalendarEntry = {
        calendar_id: currentEntry ? currentEntry.calendar_id : uuidv4(),
        habit_id: habitObject[0]?.habit_id || "",
        day_date: dateValue,
        label_id: selectedLabel.label_id,
        label_name: selectedLabel.label_name,
        label_color: selectedLabel.label_color,
      };

      // Update the calendarObject with the new entry
      setCalendarObject((prevState) => [
        ...prevState.filter((entry) => entry.day_date !== dateValue),
        newCalendarEntry,
      ]);

      // make an API call to add or update in the backend
      const method = currentEntry ? "put" : "post";
      axios[method](
        "http://localhost/huetrack/manageCalendar.php",
        newCalendarEntry
      )
        .then((response) => {
          if (response.data.status === 1) {
            console.log("Calendar entry saved successfully.");
          } else {
            console.error("Failed to save calendar entry.");
          }
        })
        .catch((error) => {
          console.error("Error saving calendar entry:", error);
        });
    } else {
      // if it's default-white or no label, remove the entry from calendarObject
      setCalendarObject((prevState) =>
        prevState.filter((entry) => entry.day_date !== dateValue)
      );

      // delete entry from backend
      axios
        .delete(
          `http://localhost/huetrack/manageCalendar.php?calendar_id=${currentEntry.calendar_id}`
        )
        .then((response) => {
          if (response.data.status === 1) {
            console.log("Calendar entry deleted successfully.");
          } else {
            console.error("Failed to delete calendar entry.");
          }
        })
        .catch((error) => {
          console.error("Error deleting calendar entry:", error);
        });
    }
  }

  function extractColorToDisplay() {
    if (!day || day.month() !== displayedMonth?.month()) return "";

    const dateValue = day.format("YYYY-MM-DD");
    const currentEntry = calendarObject.find(
      (entry) => entry.day_date === dateValue
    );

    return currentEntry ? currentEntry.label_color : "";
  }

  // Check if the day is in the current month
  const isCurrentMonthDay = day.month() === displayedMonth?.month();

  return (
    <Container>
      <div
        onClick={() => {
          if (!isCurrentMonthDay) return; // Prevent clicks for days outside the current month
          const dateValue = day.format("YYYY-MM-DD");
          handleColorUpdate(dateValue);
        }}
        style={{
          backgroundColor: extractColorToDisplay(),
          cursor: isCurrentMonthDay ? "pointer" : "default",
          borderColor: extractColorToDisplay()
            ? extractColorToDisplay()
            : "#E5E5E5",
          borderWidth: extractColorToDisplay() ? "0px" : "1px",
        }}
        className={`day-container ${isCurrentMonthDay ? "" : "out-of-month"}`}
      >
        <header>
          <p className={`date ${getCurrentDayClass()}`}>{day.format("D")}</p>
        </header>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .day-container {
    display: flex;
    flex-direction: column;
    width: 5rem;
    height: 5rem;
    margin: 0.25rem;
    transition: border-color 0.1s, background-color 0.1s;
    border-radius: 50%;
    border-style: solid;
    border-width: 1px;
    align-items: center;
    justify-content: center;
    user-select: none;
  }
  .day-container.out-of-month {
    .date {
      color: lightgrey;
    }
  }
  header {
    text-align: center;
  }
  .date {
    font-size: 1.2rem;
    padding: 0.25rem;
    margin: 0.25rem 0;
    width: 1.5rem;
    text-align: center;
  }
  .today {
    color: var(--color-black);
    font-weight: 800;
  }
`;
