const aiService = require("../services/aiService");

const explainCode = async (req, res, next) => {
  try {
    const { language, code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required",
      });
    }

    const result = await aiService.explainCode({ language, code });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const optimizeCode = async (req, res, next) => {
  try {
    const { language, code } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code snippet is required",
      });
    }

    const result = await aiService.optimizeCode({ language, code });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generateNotes = async (req, res, next) => {
  try {
    const { title, topic, difficulty, code } = req.body;
    const result = await aiService.generateNotes({ title, topic, difficulty, code });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText } = req.body;
    const result = await aiService.analyzeResume({ resumeText });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const generateInterviewQuestions = async (req, res, next) => {
  try {
    const { topic, level } = req.body;
    const result = await aiService.generateInterviewQuestions({ topic, level });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  explainCode,
  optimizeCode,
  generateNotes,
  analyzeResume,
  generateInterviewQuestions,
};
