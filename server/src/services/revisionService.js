const Revision = require("../models/Revision");
const Problem = require("../models/Problem");

const REVISION_INTERVALS = [1, 3, 7, 15, 30]; // Days

/**
 * Schedules spaced repetition revisions for a problem
 * @param {string} problemId
 * @param {string} userId
 * @param {Date} baseDate
 */
const scheduleProblemRevisions = async (problemId, userId, baseDate = new Date()) => {
  const existingCount = await Revision.countDocuments({ problem: problemId, user: userId });
  if (existingCount > 0) {
    return; // Already scheduled
  }

  const revisionsToCreate = REVISION_INTERVALS.map((days, index) => {
    const scheduled = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
    return {
      problem: problemId,
      user: userId,
      scheduledDate: scheduled,
      revisionNumber: index + 1,
      intervalDays: days,
      status: "pending",
    };
  });

  const created = await Revision.insertMany(revisionsToCreate);

  // Set the problem's nextRevisionDate to the first revision
  if (created.length > 0) {
    await Problem.findOneAndUpdate(
      { _id: problemId, user: userId },
      { nextRevisionDate: created[0].scheduledDate }
    );
  }

  return created;
};

/**
 * Marks a revision as complete and advances problem revision dates
 */
const completeRevision = async (revisionId, userId, { confidence = "medium", notes = "" } = {}) => {
  const revision = await Revision.findOne({ _id: revisionId, user: userId });
  if (!revision) {
    const error = new Error("Revision entry not found");
    error.statusCode = 404;
    throw error;
  }

  const now = new Date();
  revision.status = "completed";
  revision.completedDate = now;
  revision.confidence = confidence;
  if (notes) revision.notes = notes;
  await revision.save();

  // Find next pending revision for this problem
  const nextPending = await Revision.findOne({
    problem: revision.problem,
    user: userId,
    status: "pending",
  }).sort({ scheduledDate: 1 });

  await Problem.findOneAndUpdate(
    { _id: revision.problem, user: userId },
    {
      lastRevisedDate: now,
      $inc: { revisionCount: 1 },
      nextRevisionDate: nextPending ? nextPending.scheduledDate : null,
    }
  );

  return revision;
};

/**
 * Get grouped revision schedule for user (today, upcoming, overdue, completed)
 */
const getUserRevisions = async (userId, query = {}) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  // Update status of pending revisions that have passed today to 'overdue'
  await Revision.updateMany(
    {
      user: userId,
      status: "pending",
      scheduledDate: { $lt: startOfToday },
    },
    {
      $set: { status: "overdue" },
    }
  );

  const baseFilter = { user: userId };
  if (query.problemId) {
    baseFilter.problem = query.problemId;
  }

  const [today, overdue, upcoming, completed] = await Promise.all([
    // Today's revisions
    Revision.find({
      ...baseFilter,
      status: "pending",
      scheduledDate: { $gte: startOfToday, $lte: endOfToday },
    })
      .populate("problem", "title difficulty topic platform problemUrl status")
      .sort({ scheduledDate: 1 }),

    // Overdue revisions
    Revision.find({
      ...baseFilter,
      status: "overdue",
    })
      .populate("problem", "title difficulty topic platform problemUrl status")
      .sort({ scheduledDate: 1 }),

    // Upcoming revisions (after today)
    Revision.find({
      ...baseFilter,
      status: "pending",
      scheduledDate: { $gt: endOfToday },
    })
      .populate("problem", "title difficulty topic platform problemUrl status")
      .sort({ scheduledDate: 1 })
      .limit(20),

    // Recently completed
    Revision.find({
      ...baseFilter,
      status: "completed",
    })
      .populate("problem", "title difficulty topic platform problemUrl status")
      .sort({ completedDate: -1 })
      .limit(10),
  ]);

  return {
    today,
    overdue,
    upcoming,
    completed,
    summary: {
      dueTodayCount: today.length,
      overdueCount: overdue.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
    },
  };
};

module.exports = {
  scheduleProblemRevisions,
  completeRevision,
  getUserRevisions,
};
