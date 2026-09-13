const aiService = require("../services/aiService");
const User = require("../models/User");
const Problem = require("../models/Problem");
const Task = require("../models/Task");

const MAX_RESUME_LENGTH = 20000;
const MAX_JD_LENGTH = 20000;

const getAIStatus = async (req, res, next) => {
  try {
    const config = aiService.getAIConfig();
    res.status(200).json({
      success: true,
      data: {
        provider: config.provider,
        model: config.model,
        hasExternalProvider: config.hasExternalProvider,
        timeoutMs: config.timeoutMs,
      },
    });
  } catch (error) {
    next(error);
  }
};

const analyzeResume = async (req, res, next) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: "Resume content is required.",
      });
    }

    if (resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: "Resume content must contain at least 50 characters of plain text.",
      });
    }

    if (resumeText.length > MAX_RESUME_LENGTH) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: `Resume text exceeds maximum limit of ${MAX_RESUME_LENGTH} characters.`,
      });
    }

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: "Job description is required.",
      });
    }

    if (jobDescription.trim().length < 30) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: "Job description must contain at least 30 characters.",
      });
    }

    if (jobDescription.length > MAX_JD_LENGTH) {
      return res.status(400).json({
        success: false,
        code: "AI_INVALID_INPUT",
        message: `Job description exceeds maximum limit of ${MAX_JD_LENGTH} characters.`,
      });
    }

    const result = await aiService.analyzeResume({ resumeText, jobDescription });
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
    const {
      role,
      skills,
      topic = "Full Stack & System Architecture",
      level = "Intermediate",
      context,
      resumeText,
      jobDescription,
      mode = "Mixed",
      difficulty = "Mixed",
      previousQuestions = [],
    } = req.body;

    const result = await aiService.generateInterviewQuestions({
      role,
      skills,
      topic,
      level,
      context,
      resumeText,
      jobDescription,
      mode,
      difficulty,
      previousQuestions,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProfileContext = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const [user, solvedProblems, tasks] = await Promise.all([
      User.findById(userId).select("-password"),
      Problem.find({ user: userId, status: "Solved" }).sort({ updatedAt: -1 }),
      Task.find({ user: userId }).sort({ updatedAt: -1 }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const easyCount = solvedProblems.filter((p) => p.difficulty === "Easy").length;
    const mediumCount = solvedProblems.filter((p) => p.difficulty === "Medium").length;
    const hardCount = solvedProblems.filter((p) => p.difficulty === "Hard").length;

    const topicSet = new Set(solvedProblems.map((p) => p.topic).filter(Boolean));
    const uniqueTopics = Array.from(topicSet);
    const recentProblems = solvedProblems.slice(0, 5).map((p) => ({
      id: p._id,
      title: p.title,
      difficulty: p.difficulty,
      topic: p.topic,
    }));

    const projectSummaries = tasks.map((t) => ({
      id: t._id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      description: t.description || "",
    }));

    const skillsList = user.skills && user.skills.length > 0 ? user.skills : [];
    const combinedTopics = Array.from(new Set([...uniqueTopics, ...skillsList]));

    // Synthesize natural language prompt context for the AI
    let interviewContextParts = [];
    interviewContextParts.push(
      `Candidate Role Target: ${user.targetRole || "Software Engineer"} (${user.experienceLevel || "Intermediate"} level).`
    );
    if (skillsList.length > 0) {
      interviewContextParts.push(`Key Stated Skills: ${skillsList.join(", ")}.`);
    }
    if (solvedProblems.length > 0) {
      interviewContextParts.push(
        `DevFlow Activity: Solved ${solvedProblems.length} algorithmic problems (Easy: ${easyCount}, Medium: ${mediumCount}, Hard: ${hardCount}) across topics: ${uniqueTopics.slice(0, 8).join(", ")}.`
      );
      if (recentProblems.length > 0) {
        interviewContextParts.push(
          `Recently Solved Challenges: ${recentProblems.map((p) => p.title).join(", ")}.`
        );
      }
    }
    if (projectSummaries.length > 0) {
      interviewContextParts.push(
        `Active DevFlow Projects & Systems: ${projectSummaries.slice(0, 4).map((p) => p.title).join(", ")}.`
      );
    }
    if (user.bio) {
      interviewContextParts.push(`Background Bio: ${user.bio}`);
    }

    const interviewPromptContext = interviewContextParts.join(" ");

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetRole: user.targetRole || "Software Engineer",
          skills: skillsList,
          experienceLevel: user.experienceLevel || "Intermediate",
          bio: user.bio || "",
        },
        solvedStats: {
          total: solvedProblems.length,
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
          topics: uniqueTopics,
          recentProblems,
        },
        projects: projectSummaries,
        suggestedTopics: combinedTopics.length > 0 ? combinedTopics : ["Data Structures", "Algorithms", "System Design"],
        interviewPromptContext,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAIStatus,
  analyzeResume,
  generateInterviewQuestions,
  getProfileContext,
};
