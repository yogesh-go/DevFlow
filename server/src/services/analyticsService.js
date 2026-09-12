const mongoose = require("mongoose");
const Problem = require("../models/Problem");
const Revision = require("../models/Revision");

/**
 * Calculates comprehensive analytics and streaks for a user
 * @param {string} userId
 */
const getUserAnalytics = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 1. Overall counts & status breakdown
  const statusStats = await Problem.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  let totalProblems = 0;
  let solvedProblems = 0;
  let attemptedProblems = 0;
  let needRevisionProblems = 0;
  let notStartedProblems = 0;

  statusStats.forEach((item) => {
    totalProblems += item.count;
    if (item._id === "Solved") solvedProblems = item.count;
    if (item._id === "Attempted") attemptedProblems = item.count;
    if (item._id === "Need Revision") needRevisionProblems = item.count;
    if (item._id === "Not Started") notStartedProblems = item.count;
  });

  // 2. Difficulty breakdown (total vs solved)
  const difficultyStats = await Problem.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: {
          difficulty: "$difficulty",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const difficultyMap = {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 },
  };

  difficultyStats.forEach((item) => {
    const diff = item._id.difficulty;
    if (difficultyMap[diff]) {
      difficultyMap[diff].total += item.count;
      if (item._id.status === "Solved") {
        difficultyMap[diff].solved += item.count;
      }
    }
  });

  // 3. Topic performance (total vs solved per topic)
  const topicStats = await Problem.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: {
          topic: "$topic",
          status: "$status",
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const topicsDict = {};
  topicStats.forEach((item) => {
    const top = item._id.topic;
    if (!topicsDict[top]) {
      topicsDict[top] = { topic: top, total: 0, solved: 0 };
    }
    topicsDict[top].total += item.count;
    if (item._id.status === "Solved") {
      topicsDict[top].solved += item.count;
    }
  });

  const topicsList = Object.values(topicsDict).sort((a, b) => b.solved - a.solved);

  // 4. Platform breakdown
  const platformStats = await Problem.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$platform",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // 5. Activity over last 7 days and daily history for streaks
  const solvedRecords = await Problem.find({
    user: userObjectId,
    status: "Solved",
    solvedDate: { $ne: null },
  })
    .select("solvedDate")
    .sort({ solvedDate: 1 });

  // Map to distinct date strings YYYY-MM-DD
  const dateSet = new Set();
  solvedRecords.forEach((rec) => {
    if (rec.solvedDate) {
      const d = new Date(rec.solvedDate);
      const dateStr = d.toISOString().split("T")[0];
      dateSet.add(dateStr);
    }
  });

  const sortedDates = Array.from(dateSet).sort();

  // Streak calculation
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dStr of sortedDates) {
    const curr = new Date(dStr);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round((curr - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) longestStreak = tempStreak;
    prevDate = curr;
  }

  // Check if current streak extends to today or yesterday
  if (sortedDates.length > 0) {
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const lastSolvedDate = sortedDates[sortedDates.length - 1];
    if (lastSolvedDate === todayStr || lastSolvedDate === yesterdayStr) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }
  }

  // Last 7 days breakdown for visual charts
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const count = solvedRecords.filter((rec) => {
      if (!rec.solvedDate) return false;
      return new Date(rec.solvedDate).toISOString().split("T")[0] === dateStr;
    }).length;

    last7Days.push({
      date: dateStr,
      day: dayLabel,
      solvedCount: count,
    });
  }

  // 6. Revision consistency stats
  const revisionStats = await Revision.aggregate([
    { $match: { user: userObjectId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  let totalRevisions = 0;
  let completedRevisions = 0;
  let overdueRevisions = 0;
  let pendingRevisions = 0;

  revisionStats.forEach((r) => {
    totalRevisions += r.count;
    if (r._id === "completed") completedRevisions = r.count;
    if (r._id === "overdue") overdueRevisions = r.count;
    if (r._id === "pending") pendingRevisions = r.count;
  });

  const revisionCompletionRate =
    totalRevisions > 0 ? Math.round((completedRevisions / totalRevisions) * 100) : 100;

  const successRate =
    totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  return {
    overview: {
      totalProblems,
      solvedProblems,
      attemptedProblems,
      needRevisionProblems,
      notStartedProblems,
      successRate,
      currentStreak,
      longestStreak,
    },
    difficulty: difficultyMap,
    topics: topicsList,
    platforms: platformStats.map((p) => ({ platform: p._id, count: p.count })),
    weeklyActivity: last7Days,
    revisions: {
      totalRevisions,
      completedRevisions,
      overdueRevisions,
      pendingRevisions,
      completionRate: revisionCompletionRate,
    },
  };
};

module.exports = {
  getUserAnalytics,
};
