const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const FORMAT_LABELS = {
  talk: "Talk",
  workshop: "Workshop",
  "chalk-talk": "Chalk talk",
  "builder-session": "Builder session",
  "code-talk": "Code talk",
  webinar: "Webinar",
};

/**
 * Sorts dated entries newest first; ties break by id so the order is stable.
 * @template {{id: string, date: string}} T
 * @param {T[]} items Entries with ISO `YYYY-MM-DD` dates.
 * @returns {T[]} A new sorted array; the input is not mutated.
 */
export function newestFirst(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

/**
 * Keeps the newest entry for each exact title, so repeat deliveries of one talk appear once.
 * @template {{id: string, date: string, title: string}} T
 * @param {T[]} items Entries with ISO `YYYY-MM-DD` dates and titles.
 * @returns {T[]} A new array in newestFirst order; the input is not mutated.
 */
export function newestPerTitle(items) {
  const seen = new Set();
  return newestFirst(items).filter((item) => {
    if (seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });
}

/**
 * Groups dated entries by year, newest year first, entries sorted with newestFirst.
 * @template {{id: string, date: string}} T
 * @param {T[]} items Entries with ISO `YYYY-MM-DD` dates.
 * @returns {{year: string, entries: T[]}[]} One group per year.
 */
export function groupByYear(items) {
  const groups = new Map();
  for (const item of newestFirst(items)) {
    const year = item.date.slice(0, 4);
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(item);
  }
  return [...groups].map(([year, entries]) => ({ year, entries }));
}

/**
 * Formats an ISO date as "Sep 30, 2026" without converting through a time zone.
 * @param {string} isoDate Date as `YYYY-MM-DD`.
 * @returns {string} Short month, day, and year.
 */
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/**
 * Formats an ISO date as "May 2026".
 * @param {string} isoDate Date as `YYYY-MM-DD`.
 * @returns {string} Short month and year.
 */
export function formatMonth(isoDate) {
  const [year, month] = isoDate.split("-").map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

/**
 * Reports whether a date falls after today in UTC, the basis for the "Upcoming" label.
 * @param {string} isoDate Date as `YYYY-MM-DD`.
 * @param {Date} [now] Reference time; defaults to the build time.
 * @returns {boolean} True when the date is strictly after today.
 */
export function isUpcoming(isoDate, now = new Date()) {
  return isoDate > now.toISOString().slice(0, 10);
}
