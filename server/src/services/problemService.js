const Problem = require("../models/Problem");
const { scheduleProblemRevisions } = require("./revisionService");

/**
 * Creates a new DSA problem and schedules revisions if status is 'Solved'
 */
const createProblem = async (problemData, userId) => {
  const isSolved = problemData.status === "Solved";
  const solvedDate = isSolved ? (problemData.solvedDate || new Date()) : null;

  const problem = await Problem.create({
    ...problemData,
    user: userId,
    solvedDate,
  });

  if (isSolved) {
    await scheduleProblemRevisions(problem._id, userId, solvedDate);
  }

  return problem;
};

/**
 * Queries problems with server-side filtering, regex search, sorting, and pagination
 */
const getProblems = async (userId, queryParams = {}) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    difficulty = "all",
    topic = "all",
    platform = "all",
    status = "all",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = queryParams;

  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (parsedPage - 1) * parsedLimit;

  // Build MongoDB query filter
  const filter = { user: userId };

  // Case-insensitive search on title or notes
  if (search && search.trim() !== "") {
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { notes: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (difficulty && difficulty !== "all") {
    filter.difficulty = difficulty;
  }

  if (topic && topic !== "all") {
    filter.topic = topic;
  }

  if (platform && platform !== "all") {
    filter.platform = platform;
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  // Sort configuration
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  const [problems, totalProblems] = await Promise.all([
    Problem.find(filter).sort(sort).skip(skip).limit(parsedLimit),
    Problem.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProblems / parsedLimit) || 1;

  return {
    problems,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      totalProblems,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  };
};

/**
 * Finds a single problem by ID scoped to the authenticated user
 */
const getProblemById = async (problemId, userId) => {
  const problem = await Problem.findOne({ _id: problemId, user: userId });
  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }
  return problem;
};

/**
 * Updates a problem and triggers spaced repetition if newly marked as Solved
 */
const updateProblem = async (problemId, userId, updateData) => {
  const problem = await Problem.findOne({ _id: problemId, user: userId });
  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const wasPreviouslySolved = problem.status === "Solved";
  const isNowSolved = updateData.status === "Solved";

  // Assign update fields
  Object.assign(problem, updateData);

  if (!wasPreviouslySolved && isNowSolved) {
    if (!problem.solvedDate) {
      problem.solvedDate = new Date();
    }
    await scheduleProblemRevisions(problem._id, userId, problem.solvedDate);
  }

  await problem.save();
  return problem;
};

/**
 * Deletes a problem
 */
const deleteProblem = async (problemId, userId) => {
  const problem = await Problem.findOneAndDelete({ _id: problemId, user: userId });
  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }
  return problem;
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
