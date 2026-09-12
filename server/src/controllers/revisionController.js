const revisionService = require("../services/revisionService");
const { isValidObjectId } = require("../utils/validateObjectId");

const getRevisions = async (req, res, next) => {
  try {
    const data = await revisionService.getUserRevisions(req.user.userId, req.query);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

const scheduleRevision = async (req, res, next) => {
  try {
    const { problemId, baseDate } = req.body;

    if (!problemId || !isValidObjectId(problemId)) {
      return res.status(400).json({
        success: false,
        message: "Valid problem ID is required",
      });
    }

    const scheduled = await revisionService.scheduleProblemRevisions(
      problemId,
      req.user.userId,
      baseDate ? new Date(baseDate) : new Date()
    );

    res.status(201).json({
      success: true,
      message: "Spaced repetition revision schedule created",
      revisions: scheduled,
    });
  } catch (error) {
    next(error);
  }
};

const completeRevision = async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid revision ID format",
      });
    }

    const revision = await revisionService.completeRevision(
      req.params.id,
      req.user.userId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Revision marked as completed",
      revision,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevisions,
  scheduleRevision,
  completeRevision,
};
