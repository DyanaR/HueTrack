import { useState } from "react";
import GlobalContext from "./GlobalContext";
import dayjs from "dayjs";
import { getMonth, getYear } from "../utils/calendar";
import { colours } from "./../utils/calendar.js";
import { v4 as uuidv4 } from "uuid";

export default function ContextWrapper(props) {
  const [expand, setExpand] = useState(false); //used
  const [view, setView] = useState(true); //used
  const [daySelected, setDaySelected] = useState(dayjs()); // used in labels,
  const [monthIndex, setMonthIndex] = useState(dayjs().month()); // used
  const [yearIndex, setYearIndex] = useState(dayjs().year()); // used
  const [currentMonth, setCurrentMonth] = useState(getMonth()); // used
  const [currentYear, setCurrentYear] = useState(getYear()); //used
  const [active, setActive] = useState(false);
  const [active2, setActive2] = useState(false);
  const [title, setTitle] = useState("Alcohol Intake");

  const [userObject, setUserObject] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [habitObject, setHabitObject] = useState([
    {
      habit_id: "",
      uid: "",
      habit_name: "",
      created_at: "",
    },
  ]);

  const [labelObject, setLabelObject] = useState([
    {
      // label_id: "",
      // habit_id: "",
      // label_title: "",
      // label_color: "",
    },
  ]);

  const [calendarObject, setCalendarObject] = useState([
    // {
    //   calendar_id: "",
    //   habit_id: "",
    //   day_date: "", // store year-month-day
    //   label_id: "", // reference label/color for selected day
    // }, // foreign key to reference the label for this day
  ]);

  const [statObject, setStatObject] = useState([
    {
      stat_id: "",
      habit_id: "",
      label_id: "",
      color_count: "",
    },
  ]);

  return (
    <GlobalContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        yearIndex,
        setYearIndex,
        currentMonth,
        setCurrentMonth,
        currentYear,
        setCurrentYear,
        expand,
        setExpand,
        view,
        setView,
        daySelected,
        setDaySelected,
        //color dict
        labelObject,
        setLabelObject,
        statObject,
        setStatObject,
        active,
        setActive,
        active2,
        setActive2,
        title,
        setTitle,
        habitObject,
        setHabitObject,
        calendarObject,
        setCalendarObject,
        userObject,
        setUserObject,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
