const sec = 1000;
const minute = sec * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const shortDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fullDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const shortMonths = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec"
];
const fullMonths = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december"
];
const dayInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getLeapYear = date => {
  const year = date instanceof Date ? new Date(date).getFullYear() : date;
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

function setMidnight(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

function getDateString(date = new Date(), format = "yyyy-mm-dd") {
  const copy = new Date(Number(date));
  let result = "";
  const code = {
    yyyy: "year",
    mm: "month",
    dd: "day"
  };
  const check = {
    month: copy.getMonth() + 1,
    year: copy.getFullYear(),
    day: copy.getDate()
  };

  const arrFormat = format.split("-");
  arrFormat.forEach((key, index) => {
    if (index === 0) {
      result = check[code[key]];
    } else {
      result += `-${check[code[key]]}`;
    }
  });
  return result;
}

function setPastDate(date = new Date(), days = 1) {
  const copy = new Date(Number(date));
  copy.setDate(copy.getDate() - days);
  return copy;
}

function setFutureDate(date = new Date(), days = 1) {
  const copy = new Date(Number(date));
  copy.setDate(copy.getDate() + days);
  return copy;
}
const time = {
  sec,
  minute,
  hour,
  day,
  week,
  shortMonths,
  fullMonths,
  shortDays,
  fullDays,
  getLeapYear,
  lowercaseShortDays: shortDays.map(d => d.toLowerCase()),
  dayInMonth,
  setMidnight,
  getDateString,
  setPastDate,
  setFutureDate
};

export default time;
