const problemService = require("../services/problemService");
const { isValidObjectId } = require("../utils/validateObjectId");

const createProblem = async (req, res, next) => {
  try {
    const { title, difficulty, topic } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Problem title is required",
      });
    }

    if (!difficulty) {
      return res.status(400).json({
        success: false,
        message: "Difficulty level is required",
      });
    }

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: "Topic category is required",
      });
    }

    const problem = await problemService.createProblem(req.body, req.user.userId);

    res.status(201).json({
      success: true,
      message: "Problem added successfully",
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const getProblems = async (req, res, next) => {
  try {
    const result = await problemService.getProblems(req.user.userId, req.query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID format",
      });
    }

    const problem = await problemService.getProblemById(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID format",
      });
    }

    const problem = await problemService.updateProblem(
      req.params.id,
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid problem ID format",
      });
    }

    await problemService.deleteProblem(req.params.id, req.user.userId);

    res.status(200).json({
      success: true,
      message: "Problem removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
