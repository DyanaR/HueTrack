import dayjs from "dayjs";
import React from "react";
import { getYear, getMonth } from "../utils/calendar.js";

const GlobalContext = React.createContext({
  expand: false,
  setExpand: () => {},
  view: false,
  setView: () => {},
  monthIndex: 0,
  setMonthIndex: () => {},
  yearIndex: dayjs().year(),
  setYearIndex: () => {},
  active: false,
  setActive: () => {},
  active2: false,
  setActive2: () => {},
  title: "",
  setTitle: () => {},
  currentMonth: getMonth(),
  setCurrentMonth: () => {},
  currentYear: getYear(),
  setCurrentYear: () => {},
  habitObject: "",
  setHabitObject: () => {},
  calendarObject: "",
  setCalendarObject: () => {},
  userObject: "",
  setUserObject: () => {},
});

export default GlobalContext;
