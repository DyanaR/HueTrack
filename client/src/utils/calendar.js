import dayjs from "dayjs";

export const colours = [
  //"",
  "#F36D65",
  "#A0C2DD",
  "#CFC1D7",
  "#ECC7A1",
  // "#F1E9BB",
  "#EEA3A1",
  "#B4BC8C",
  "#808080",
];

export function getMonth(month = dayjs().month(), year = dayjs().year()) {
  month = Math.floor(month);
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  const daysInMonth = dayjs(new Date(year, month + 1, 0)).date();
  const totalWeeks = Math.ceil((daysInMonth + firstDayOfTheMonth) / 7);

  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(totalWeeks).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      // if (currentMonthCount <= 0 || currentMonthCount > daysInMonth) {
      //   return null; // Set days before the first day and after the last day to null
      // }
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}

export function getYear(year = dayjs().year()) {
  const month = dayjs().month();

  const firstMonthOfYear = dayjs().year(year).month(month).startOf("year");
  const lastMonthOfYear = dayjs().year(year).month(month).endOf("year");

  const arrayOfMonth = [];

  for (let i = firstMonthOfYear.month(); i <= lastMonthOfYear.month(); i++) {
    arrayOfMonth.push({
      monthNames: firstMonthOfYear.month(i),
      month: getMonth(firstMonthOfYear.month(i).month(), year),
    });
  }

  return arrayOfMonth;
}
