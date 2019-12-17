const sec = 1000;
const minute = sec * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const fullDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
const shortMonths = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec'
];
const fullMonths = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december'
];
const dayInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const getLeapYear = date => {
  const year = date instanceof Date ? new Date(date).getFullYear() : date;
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};

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
  dayInMonth
};

export default time;
