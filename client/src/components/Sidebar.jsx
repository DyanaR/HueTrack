import React, { useContext, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Stats from "./Stats";
import Labels from "./Labels";
import GlobalContext from "../context/GlobalContext";
import { UserAuth } from "../context/AuthContext";
import { MdEdit } from "react-icons/md";
import { MdDownloadDone } from "react-icons/md";
import axios from "axios";

const Sidebar = () => {
  const { labelObject, habitObject, active2, setActive2, setHabitObject } =
    useContext(GlobalContext);

  const { user } = UserAuth(); // access Firebase user from AuthContext

  const [isEditing, setIsEditing] = useState(false);
  // local state for the habit name input
  const [habitNameInput, setHabitNameInput] = useState(
    habitObject[0]?.habit_name
  );
  const [originalHabitName, setOriginalHabitName] = useState(
    habitObject[0]?.habit_name
  ); // store the original name

  const inputRef = useRef(null);

  // focus input field when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // focus on the input field
    }
  }, [isEditing]);

  // fetch habits when user logs in or page refreshes
  useEffect(() => {
    if (user?.uid) {
      fetchHabits(user.uid);
    }
  }, [user]);

  const fetchHabits = (uid) => {
    axios
      .get(`http://localhost/huetrack/getHabits.php?uid=${uid}`)
      .then((response) => {
        setHabitObject(response.data); // update state with fetched habits
        setOriginalHabitName(response.data[0]?.habit_name); // store the original name after fetching
        setHabitNameInput(response.data[0]?.habit_name); // set the input to the current habit name
      })
      .catch((error) => {
        console.error("Error fetching habits:", error);
      });
  };

  const showMenu = () => {
    setActive2(!active2);
  };

  const handleEditClick = () => {
    setIsEditing(true); // enable editing mode
    setOriginalHabitName(habitNameInput); // Store the original name when entering edit mode
  };

  const handleChange = () => {
    // check if habit name input was changed
    if (habitNameInput === originalHabitName) {
      console.log(
        "No changes were made to the habit name. Skipping POST request."
      );
      setIsEditing(false); // disable editing mode
      return; // exit without sending a PUT request
    }

    // update locally the habit name only when "Save" is clicked
    setHabitObject((prevHabit) => [
      {
        ...prevHabit[0],
        habit_name: habitNameInput, // update the habit_name with the input value
      },
    ]);

    // prepare data to send to backend
    const data = {
      habit_name: habitNameInput,
      uid: user?.uid,
    };

    // send PUT request to PHP API
    axios
      .put("http://localhost/huetrack/addHabits.php", data)
      .then((response) => {
        if (response.data.message) {
          console.log("Habit updated successfully:", response.data.message);
        } else if (response.data.error) {
          console.error("Error updating habit:", response.data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleChange(); // save on Enter key press
    }
  };

  return (
    <Container>
      <div className="sidebar-container">
        <div className="labels-container">
          <h5>Habit</h5>
          {/* <p style={{ fontSize: ".6rem", lineHeight: "100%" }}>Habit Name</p> */}
          <div
            className="habit-cont"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: ".8rem",
            }}
          >
            <div className="habit-input">
              {isEditing ? (
                <input
                  ref={inputRef} // ref for auto focus
                  style={{
                    width: "10rem",
                    border: "none",
                    backgroundColor: "white",
                  }}
                  type="text"
                  value={habitNameInput}
                  onChange={(e) => setHabitNameInput(e.target.value)} // Update the input field state
                  onBlur={handleChange} // save when the input loses focus
                  onKeyDown={handleKeyDown} // save when Enter is pressed
                />
              ) : (
                habitObject[0]?.habit_name
              )}
            </div>
            <div className="edit" type="button">
              <span>
                <MdEdit
                  style={{ cursor: "pointer", float: "right" }}
                  onClick={handleEditClick}
                />
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: ".8rem",
            }}
          >
            <h5>Labels</h5>
            {/* <button style={{ float: "right" }} onClick={showMenu}>
              Edit
              <MdEdit />
            </button> */}
          </div>

          {/* display labels on sidebar */}
          {/* {labelObject?.map((label, index) => (
            <div className="labels-info" key={index}>
              <div>
                <div
                  style={{ backgroundColor: `${label?.label_color}` }}
                  className="color-box"
                ></div>
              </div>
              <div className="color-name">
                {<p style={{ color: "black" }}>{label?.label_title || ""}</p>}
              </div>
            </div>
          ))} */}
        </div>
        <Labels />
        <Stats />
      </div>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  .sidebar-container {
    padding: 0rem 1.3rem 0 2.5rem;
    background-color: var(--color-white);
    border-right: 2px solid var(--color-border);
    ${"" /* position: absolute; */}
    ${"" /* float: left; */}
    ${"" /* width: 18rem; */}
    top: 0px;
    bottom: 0px;
    ${"" /* height: 100%; */}
    width: 18rem;
    max-width: 100%;
  }
  .title {
    margin-bottom: 1rem;
  }
  .habit-input {
    ${"" /* margin-bottom: 1.5rem; */}
    ${"" /* margin-top: 0.2rem; */}
    background-color: var(--color-input);
    height: 2rem;
    padding-left: 1rem;
    align-items: center;
    border-radius: 5px;
    display: flex;
    width: 12rem;
  }
  .color-name {
    background-color: var(--color-input);
    width: 100%;
    border-radius: 5px;
    padding-left: 1rem;
  }
  .color-box {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 2px;
  }
  .edit {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
  }
  .label-container {
  }
  .habit_cont {
  }
  .labels-info {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
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
    height: 1.5rem;
    width: max-content;
    padding: 0.2rem 0.4rem;
    gap: 0.3rem;
  }
  @media screen and (max-width: 1000px) {
    .color-name {
      width: 12rem;
    }
    .habit-name {
      width: 14.5rem;
    }
    .sidebar-container {
      padding: 0rem 1rem 0 2.5rem;
    }
  }
  @media screen and (max-width: 800px) {
    .sidebar-container {
      display: none;
    }
  }
`;
