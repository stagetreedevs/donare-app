import { format } from 'date-fns';

export function getDateFromDateString(dateString) {
  const dateMatch = dateString?.match(
    /(\d{1,2})\/(\d{1,2})\/(\d{4})\s?(\d{0,2}):?(\d{0,2}):?(\d{0,2}):?(\d{0,3})/,
  );

  if (!dateMatch) return false;

  const [
    ,
    day,
    month,
    year,
    hours = 0,
    minutes = 0,
    seconds = 0,
    ms = 0,
  ] = dateMatch;

  // contagem do mês começa em 0, que representa janeiro
  return new Date(year, month - 1, day, hours, minutes, seconds, ms);
}

export function GetDateAgoExactly(date, daysAgo) {
  const dateAMonthAgo = new Date(date.valueOf());
  dateAMonthAgo.setDate(dateAMonthAgo.getDate() - daysAgo);

  return dateAMonthAgo;
}

export function getDateAMonthAgo(date) {
  const dateAMonthAgo = new Date(date.valueOf());
  dateAMonthAgo.setMonth(dateAMonthAgo.getMonth() - 1);

  return dateAMonthAgo;
}

export function getDateStringFromDate(date, timeFormat = 'HH:mm:ss:SSS') {
  return format(date, `dd/MM/yyyy ${timeFormat}`);
}

export function getDayWithSpecificHours(
  day: Date,
  completeHours: string,
): Date {
  if(!completeHours)return new Date()
  const dayWithSpecificHours = new Date(day.valueOf());
  const [hours, min = 0, sec = 0, ms = 0] = completeHours
    .split(':')
    .map(value => Number(value));

  dayWithSpecificHours.setHours(hours, min, sec, ms);

  return dayWithSpecificHours;
}