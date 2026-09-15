/**
 * Returns a dynamic greeting string based on the user's local time or a provided Date object.
 *
 * Day Parting Logic:
 *  - 05:00 AM – 11:59 AM: "Good morning"
 *  - 12:00 PM – 04:59 PM: "Good afternoon"
 *  - 05:00 PM – 08:59 PM: "Good evening"
 *  - 09:00 PM – 04:59 AM: "Good night"
 *
 * @param {Date} [date=new Date()] Optional Date instance (defaults to current local time).
 * @returns {string} The contextual greeting.
 */
export function getTimeBasedGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }
  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }
  if (hour >= 17 && hour < 21) {
    return "Good evening";
  }
  return "Good night";
}

export default getTimeBasedGreeting;
