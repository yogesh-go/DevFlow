/**
 * Contest Calendar Service
 * Fetches upcoming contests across LeetCode, Codeforces, CodeChef, and AtCoder
 */

const getUpcomingContests = async () => {
  try {
    const response = await fetch("https://kontests.net/api/v1/all", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(4000),
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.slice(0, 15).map((c) => ({
          name: c.name,
          platform: c.site || "Competitive Programming",
          url: c.url,
          startTime: c.start_time,
          endTime: c.end_time,
          duration: `${Math.round(parseInt(c.duration, 10) / 60)} mins`,
          status: c.status || "BEFORE",
        }));
      }
    }
  } catch (err) {
    console.warn("Public contest API unreachable, using curated schedule:", err.message);
  }

  // Curated recurring contest schedule for LeetCode, Codeforces, CodeChef
  const now = new Date();
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
  nextSunday.setHours(8, 0, 0, 0);

  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  nextSaturday.setHours(20, 0, 0, 0);

  const nextWednesday = new Date(now);
  nextWednesday.setDate(now.getDate() + ((3 - now.getDay() + 7) % 7 || 7));
  nextWednesday.setHours(20, 0, 0, 0);

  return [
    {
      name: "LeetCode Weekly Contest",
      platform: "LeetCode",
      url: "https://leetcode.com/contest/",
      startTime: nextSunday.toISOString(),
      duration: "90 mins",
      status: "Upcoming",
    },
    {
      name: "LeetCode Biweekly Contest",
      platform: "LeetCode",
      url: "https://leetcode.com/contest/",
      startTime: nextSaturday.toISOString(),
      duration: "90 mins",
      status: "Upcoming",
    },
    {
      name: "Codeforces Round (Div. 2)",
      platform: "Codeforces",
      url: "https://codeforces.com/contests",
      startTime: nextWednesday.toISOString(),
      duration: "120 mins",
      status: "Upcoming",
    },
    {
      name: "CodeChef Starters",
      platform: "CodeChef",
      url: "https://www.codechef.com/contests",
      startTime: nextWednesday.toISOString(),
      duration: "120 mins",
      status: "Upcoming",
    },
    {
      name: "GeeksforGeeks Weekly Coding Contest",
      platform: "GeeksforGeeks",
      url: "https://practice.geeksforgeeks.org/events/rec/gfg-weekly-coding-contest",
      startTime: nextSunday.toISOString(),
      duration: "90 mins",
      status: "Upcoming",
    },
  ];
};

module.exports = {
  getUpcomingContests,
};
