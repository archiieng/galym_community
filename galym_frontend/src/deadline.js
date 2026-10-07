// Deadlines arrive from the API as date-only strings ("2027-03-01").
// Everything here works in whole calendar days so time zones cannot shift a date.

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parts(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);

  return { year, month, day };
}

// Today as the API writes dates ("2027-03-01"), in the visitor's own time zone.
export function todayIso() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Negative once the deadline has passed.
export function daysLeft(isoDate) {
  const { year, month, day } = parts(isoDate);
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((Date.UTC(year, month - 1, day) - today) / MS_PER_DAY);
}

export function daysLeftLabel(days) {
  if (days < 0) return "Closed";
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day left";

  return `${days} days left`;
}

// Which chip colour a deadline gets: a week or less is urgent, a month is soon.
export function urgency(days) {
  if (days < 0) return "closed";
  if (days <= 7) return "urgent";
  if (days <= 30) return "soon";

  return "open";
}

// { day: 1, month: "Mar", year: 2027 } for the ticket stub.
export function dateParts(isoDate) {
  const { year, month, day } = parts(isoDate);

  return { day, month: MONTHS[month - 1], year };
}

// "1 Mar 2027"
export function formatDate(isoDate) {
  const { day, month, year } = dateParts(isoDate);

  return `${day} ${month} ${year}`;
}
