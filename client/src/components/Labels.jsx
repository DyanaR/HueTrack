import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/GlobalContext";
import { TiDelete } from "react-icons/ti";
import styled from "styled-components";
import { AiOutlinePlus } from "react-icons/ai";
import Dropdown from "./Dropdown";
import { v4 as uuidv4 } from "uuid";
import { NotificationManager } from "react-notifications";
import axios from "axios";

export default function Labels() {
  const { labelObject, setLabelObject, habitObject, setCalendarObject } =
    useContext(GlobalContext);

  const [labelNameError, setLabelNameError] = useState("");

  const validateLabelName = (labelName) => {
    if (!labelName) {
      return "Label name is required.";
    }

    const regex = /^(?! )[a-zA-Z0-9+_-]+(?: [a-zA-Z0-9+_-]+)*(?! )$/;

    // check for consecutive special characters
    if (/\+\+|--|__/.test(labelName)) {
      return "Invalid input: No consecutive '+', '-', or '_' allowed.";
    }

    if (!regex.test(labelName)) {
      return "Invalid input. Only letters, digits, single space, _, -, and +.";
    }

    if (labelName.length > 10) {
      return "Must be 10 characters or fewer.";
    }

    return null; // valid
  };

  const validateLabelColor = (labelColor) => {
    const regex = /^#[0-9A-Fa-f]{6}$/;
    if (!regex.test(labelColor)) {
      return "Invalid label color. Use HEX format (e.g., #FFFFFF).";
    }
    return null; // valid
  };

  // fetch labels from backend based on the current habit_id
  useEffect(() => {
    if (habitObject[0]?.habit_id) {
      axios
        .get(
          `http://localhost/huetrack/getLabels.php?habit_id=${habitObject[0].habit_id}`
        )
        .then((response) => {
          if (response.data.status === 1) {
            setLabelObject(response.data.data); // set fetched labels in labelObject
          } else {
            console.error("Failed to fetch labels:", response.data.message);
            NotificationManager.error("Failed to fetch labels.", "Error");
          }
        })
        .catch((error) => {
          console.error("Error fetching labels:", error);
          NotificationManager.error(
            "An error occurred while fetching labels.",
            "Error"
          );
        });
    }
  }, [habitObject]);

  // update the specific field (label_name or label_color) based on the input
  const handleLabelChange = (e, label, field) => {
    const { value } = e.target;

    // temporarily allow all changes during typing
    const updatedLabels = labelObject.map((l) => {
      if (l.label_id === label.label_id) {
        return {
          ...l,
          [field]: value,
        };
      }
      return l;
    });
    setLabelObject(updatedLabels);

    // validate only after typing
    if (field === "label_name") {
      setLabelNameError(""); // clear error during typing
    }
  };

  const handleBlur = (e, label) => {
    const error = validateLabelName(e.target.value);
    if (error) {
      setLabelNameError(error);
    } else {
      // send valid data to the backend
      const data = {
        label_id: label.label_id,
        habit_id: habitObject[0]?.habit_id,
        label_name: e.target.value,
      };

      axios
        .put("http://localhost/huetrack/updateLabel.php", data)
        .then((response) => {
          if (response.data.status === 1) {
            console.log("Label updated successfully.");
          } else {
            console.error("Failed to update label.");
            NotificationManager.error("Failed to update label.", "Error");
          }
        })
        .catch((error) => {
          console.error("Error updating label:", error);
          NotificationManager.error(
            "An error occurred while updating label.",
            "Error"
          );
        });
    }
  };
  const handleLabelAdd = () => {
    if (labelObject.length >= 6) {
      NotificationManager.error("Label limit has been reached.", "Failure");
      return;
    }

    const newLabel = {
      label_id: uuidv4(), // generate a new UUID for the label
      habit_id: habitObject[0]?.habit_id, // current habit ID
      label_name: "New Label", // default name for new label
      label_color: "#d6d6d6", // default color for new label
    };

    setLabelObject([...labelObject, newLabel]);

    // send POST request to add new label to the database
    axios
      .post("http://localhost/huetrack/addLabels.php", {
        habit_id: habitObject[0]?.habit_id,
        labels: [newLabel], // wrap new label in an array for the labels key
      })
      .then((response) => {
        if (response.data.status === 1) {
          console.log("Label added successfully.");
        } else {
          console.error("Failed to add label.");
        }
      })
      .catch((error) => {
        console.error("Error adding label:", error);
      });
  };

  const handleLabelRemove = (label) => {
    const updatedLabels = labelObject.filter(
      (l) => l.label_id !== label.label_id
    );
    setLabelObject(updatedLabels);

    // update the calendar to remove entries associated with this label
    //without having to refresh the page
    setCalendarObject((prevState) =>
      prevState.filter((entry) => entry.label_id !== label.label_id)
    );

    // send DELETE request to remove label from the database
    axios
      .delete(
        `http://localhost/huetrack/deleteLabel.php?label_id=${label.label_id}`
      )
      .then((response) => {
        if (response.data.status === 1) {
          console.log("Label deleted successfully.");
        } else {
          console.error("Failed to delete label.");
        }
      })
      .catch((error) => {
        console.error("Error deleting label:", error);
        // notify the user of the error
        NotificationManager.error("Failed to delete label.", "Error");

        // in case of failure to delete, we restore the original label state
        setLabelObject([...labelObject]);
      });
  };

  return (
    <Container>
      <div className="habits-container">
        <button onClick={() => handleLabelAdd()}>
          <AiOutlinePlus />
          Add Color
        </button>
        {/* <button onClick={handleReset}>Reset</button> */}
        <form className="habits-form">
          {/* <input
            type="text"
            name="title"
            placeholder="Habit Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          /> */}
          <div className="habit-info">
            {labelObject.map((label, index) => (
              <div key={index} className="labels">
                <div className="color-selection">
                  <Dropdown label={label} />
                </div>
                <input
                  type="text"
                  name="label-name"
                  placeholder="Label Name"
                  value={label.label_name}
                  required
                  onChange={(e) => handleLabelChange(e, label, "label_name")}
                  onBlur={(e) => handleBlur(e, label)}
                />

                {labelObject.length !== 1 && (
                  <div
                    className="remove"
                    type="button"
                    onClick={() => handleLabelRemove(label)}
                  >
                    <span>
                      <TiDelete style={{ cursor: "pointer" }} />
                    </span>
                  </div>
                )}
              </div>
            ))}
            {labelNameError && (
              <div className="error-text">{labelNameError}</div>
            )}
          </div>
          <footer>
            {/* <button type="submit" onClick={handleSubmit}>
              Save
            </button> */}
          </footer>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .color-selection {
    display: flex;
    align-items: center;
  }
  .remove {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
  }
  .labels {
    display: flex;
    padding: 0.2rem, 0.5rem;
    gap: 0.5rem;
    max-width: 100%;
  }
  .habit-info {
    max-width: 100%;
  }
  input {
    margin: 0.5rem 0;
  }
  input[type="text"] {
    padding-left: 1rem;
    border: none;
    height: 2rem;
    border-radius: 5px;
    ${"" /* background-color: var(--color-input); */}
    border: 1.5px solid #D7D7D7;
  }
  input:hover {
    border: 1.5px solid #1eacd6;
  }
  .error-text {
    color: red;
    font-size: 0.9rem;
    margin-top: 0.2rem;
    max-width: 100%; /* Prevent the error message from exceeding the parent container's width */
    word-wrap: break-word; /* Ensure long words are broken to fit within the container */
    overflow-wrap: break-word; /* Break lines if the word is too long for the container */
    white-space: normal; /* Allow text to wrap */
  }
  .buttons {
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
    height: auto;
    width: max-content;
    padding: 0.2rem 0.4rem;
    gap: 0.3rem;
  }
  ${
    "" /* button:hover {
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);
  } */
  }
`;
