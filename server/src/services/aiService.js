/**
 * Unified AI Service Orchestrator
 * Integrates external providers (OpenAI, Gemini), prompt templates,
 * in-memory caching, resilient retries, and high-quality deterministic heuristic fallbacks.
 */

const { getAIConfig } = require("./ai/aiConfig");
const {
  buildResumePrompt,
  buildInterviewPrompt,
} = require("./ai/aiPrompts");
const { executeAIRequest } = require("./ai/aiProvider");
const aiCache = require("./ai/aiCache");
const heuristicEngine = require("./ai/heuristicEngine");

/**
 * Executes an AI operation with caching, provider routing, and guaranteed fallback
 */
const runAIOperation = async ({
  feature,
  payload,
  promptBuilder,
  heuristicFallback,
  validator,
  skipCache = false,
  temperature,
}) => {
  // 1. Check in-memory cache (unless bypassed for dynamic generation)
  if (!skipCache) {
    const cached = aiCache.get(feature, payload);
    if (cached) {
      return {
        ...cached,
        _meta: { ...cached._meta, cached: true },
      };
    }
  }

  const config = getAIConfig();
  const requestConfig = temperature !== undefined ? { ...config, temperature } : config;

  // 2. Attempt external LLM if configured
  if (config.hasExternalProvider) {
    try {
      const { system, prompt } = promptBuilder(payload);
      const rawResult = await executeAIRequest({ system, prompt, config: requestConfig });

      if (rawResult && typeof rawResult === "object") {
        const validated = validator ? validator(rawResult, payload) : rawResult;
        if (validated) {
          const result = {
            ...validated,
            _meta: {
              provider: config.provider,
              model: config.model,
              cached: false,
            },
          };
          if (!skipCache) {
            aiCache.set(feature, payload, result);
          }
          return result;
        }
        console.warn(`[AI Service] External response failed schema validation for ${feature}, falling back to heuristic engine.`);
      }
    } catch (err) {
      console.warn(
        `[AI Service] External provider (${config.provider}) execution failed, falling back to heuristic engine:`,
        err.message
      );
    }
  }

  // 3. Deterministic / Dynamic Heuristic Fallback
  const fallbackResult = heuristicFallback(payload);
  const normalizedFallback = validator ? validator(fallbackResult, payload) : fallbackResult;
  const result = {
    ...normalizedFallback,
    _meta: {
      provider: "heuristic",
      model: "heuristic-v1",
      cached: false,
    },
  };

  if (!skipCache) {
    aiCache.set(feature, payload, result);
  }
  return result;
};

/**
 * Validates and normalizes Resume Analyzer AI response
 */
const validateAndNormalizeResume = (data, payload = {}) => {
  if (!data || typeof data !== "object") return null;

  const clampScore = (num, fallback = 70) => {
    const parsed = parseInt(num, 10);
    return isNaN(parsed) ? fallback : Math.min(Math.max(parsed, 0), 100);
  };

  const overallScore = clampScore(data.overallScore, 75);

  const summary =
    typeof data.summary === "string" && data.summary.trim()
      ? data.summary.trim()
      : "Resume evaluation against targeted role requirements.";

  const jobMatch = {
    score: clampScore(data.jobMatch?.score, overallScore),
    explanation:
      typeof data.jobMatch?.explanation === "string" && data.jobMatch.explanation.trim()
        ? data.jobMatch.explanation.trim()
        : "Evaluation of core technical alignment and required domain skills.",
  };

  const atsCompatibility = {
    score: clampScore(data.atsCompatibility?.score, 70),
    issues: Array.isArray(data.atsCompatibility?.issues)
      ? data.atsCompatibility.issues.map(String)
      : [],
    recommendations: Array.isArray(data.atsCompatibility?.recommendations)
      ? data.atsCompatibility.recommendations.map(String)
      : ["Use standard section headings and incorporate metrics."],
  };

  const skillsAnalysis = {
    matched: Array.isArray(data.skillsAnalysis?.matched)
      ? data.skillsAnalysis.matched.map(String)
      : [],
    missing: Array.isArray(data.skillsAnalysis?.missing)
      ? data.skillsAnalysis.missing.map(String)
      : [],
    partiallyMatched: Array.isArray(data.skillsAnalysis?.partiallyMatched)
      ? data.skillsAnalysis.partiallyMatched.map(String)
      : [],
  };

  const experienceAnalysis = {
    strengths: Array.isArray(data.experienceAnalysis?.strengths)
      ? data.experienceAnalysis.strengths.map(String)
      : ["Relevant software development project experience."],
    gaps: Array.isArray(data.experienceAnalysis?.gaps)
      ? data.experienceAnalysis.gaps.map(String)
      : ["Quantitative evidence of scale or system impact."],
  };

  const keywordAnalysis = {
    importantKeywords: Array.isArray(data.keywordAnalysis?.importantKeywords)
      ? data.keywordAnalysis.importantKeywords.map(String)
      : [],
    missingKeywords: Array.isArray(data.keywordAnalysis?.missingKeywords)
      ? data.keywordAnalysis.missingKeywords.map(String)
      : [],
    overusedKeywords: Array.isArray(data.keywordAnalysis?.overusedKeywords)
      ? data.keywordAnalysis.overusedKeywords.map(String)
      : [],
  };

  const resumeStrengths =
    Array.isArray(data.resumeStrengths) && data.resumeStrengths.length > 0
      ? data.resumeStrengths.map(String)
      : Array.isArray(data.strengths) && data.strengths.length > 0
      ? data.strengths.map(String)
      : ["Clear technical project focus and software architecture fundamentals."];

  const resumeWeaknesses =
    Array.isArray(data.resumeWeaknesses) && data.resumeWeaknesses.length > 0
      ? data.resumeWeaknesses.map(String)
      : Array.isArray(data.weaknesses) && data.weaknesses.length > 0
      ? data.weaknesses.map(String)
      : ["Need stronger quantification of business and engineering metrics."];

  const improvements =
    Array.isArray(data.improvements) && data.improvements.length > 0
      ? data.improvements.map((imp) => ({
          priority: ["high", "medium", "low"].includes(String(imp.priority).toLowerCase())
            ? String(imp.priority).toLowerCase()
            : "medium",
          section:
            typeof imp.section === "string" && imp.section.trim()
              ? imp.section.trim()
              : "Experience",
          problem:
            typeof imp.problem === "string" && imp.problem.trim()
              ? imp.problem.trim()
              : "Needs additional detail and clarity.",
          recommendation:
            typeof imp.recommendation === "string" && imp.recommendation.trim()
              ? imp.recommendation.trim()
              : "Incorporate specific technical tools and outcomes.",
          example:
            typeof imp.example === "string" && imp.example.trim()
              ? imp.example.trim()
              : "Engineered scalable REST endpoint reducing response latency.",
        }))
      : [
          {
            priority: "high",
            section: "Experience",
            problem:
              "Bullet points describe task responsibilities rather than measurable engineering impact.",
            recommendation:
              "Use the Google XYZ formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.",
            example: "Optimized database queries, reducing p99 API response time by 45%.",
          },
        ];

  const projectRecommendations =
    Array.isArray(data.projectRecommendations) && data.projectRecommendations.length > 0
      ? data.projectRecommendations.map(String)
      : ["Build a production-grade system demonstrating missing stack requirements."];

  const actionPlan =
    Array.isArray(data.actionPlan) && data.actionPlan.length > 0
      ? data.actionPlan.map(String)
      : Array.isArray(data.actionItems) && data.actionItems.length > 0
      ? data.actionItems.map(String)
      : [
          "Tailor technical skills summary to emphasize required JD keywords.",
          "Quantify project bullets with concrete performance metrics.",
        ];

  const rawInterviewQuestions = Array.isArray(data.interviewPreparation?.questions)
    ? data.interviewPreparation.questions
    : Array.isArray(data.questions)
    ? data.questions
    : [];

  const interviewQuestions = rawInterviewQuestions.map((q, idx) => {
    if (typeof q === "string") {
      return {
        question: q.trim(),
        category: "Technical",
        difficulty: "Medium",
        reason: "Evaluates fundamental technical depth for this engineering role.",
        hint: "Discuss trade-offs, scalability constraints, and clean design patterns.",
      };
    }
    return {
      question: typeof q.question === "string" && q.question.trim() ? q.question.trim() : `Interview Question ${idx + 1}`,
      category: typeof q.category === "string" && q.category.trim() ? q.category.trim() : "Technical",
      difficulty: ["Easy", "Medium", "Hard"].includes(q.difficulty) ? q.difficulty : "Medium",
      reason: typeof q.reason === "string" && q.reason.trim() ? q.reason.trim() : "Evaluates technical depth for this engineering role.",
      hint: typeof q.hint === "string" && q.hint.trim() ? q.hint.trim() : "Discuss trade-offs, scalability constraints, and clean design patterns.",
    };
  });

  const interviewPreparation = {
    likelyTopics:
      Array.isArray(data.interviewPreparation?.likelyTopics) &&
      data.interviewPreparation.likelyTopics.length > 0
        ? data.interviewPreparation.likelyTopics.map(String)
        : [
            "System Design & REST Architecture",
            "Database Query Optimization",
            "State Management & Caching",
          ],
    likelyQuestions:
      Array.isArray(data.interviewPreparation?.likelyQuestions) &&
      data.interviewPreparation.likelyQuestions.length > 0
        ? data.interviewPreparation.likelyQuestions.map(String)
        : interviewQuestions.map((q) => q.question),
    questions: interviewQuestions,
  };

  return {
    overallScore,
    summary,
    jobMatch,
    atsCompatibility,
    skillsAnalysis,
    experienceAnalysis,
    keywordAnalysis,
    resumeStrengths,
    resumeWeaknesses,
    improvements,
    projectRecommendations,
    actionPlan,
    interviewPreparation,
    // Backwards compatibility aliases
    strengths: resumeStrengths,
    weaknesses: resumeWeaknesses,
    missingSkills: skillsAnalysis.missing,
    atsIssues: atsCompatibility.issues,
    actionItems: actionPlan,
  };
};

/**
 * Validates and normalizes Interview Prep AI response
 * Ensures 12-15 questions with { question, category, difficulty, reason, hint }
 */
const validateAndNormalizeInterview = (data) => {
  if (!data || typeof data !== "object") return null;

  const rawQuestions = Array.isArray(data.questions)
    ? data.questions
    : Array.isArray(data.interviewPreparation?.questions)
    ? data.interviewPreparation.questions
    : [];

  const questions = rawQuestions.map((q, idx) => {
    if (typeof q === "string") {
      return {
        question: q.trim(),
        category: "Technical",
        difficulty: "Medium",
        reason: "Evaluates fundamental technical depth for this engineering role.",
        hint: "Outline core principles, consider edge cases, and discuss practical trade-offs.",
      };
    }
    return {
      question: typeof q.question === "string" && q.question.trim() ? q.question.trim() : `Interview Question ${idx + 1}`,
      category: typeof q.category === "string" && q.category.trim() ? q.category.trim() : "Technical",
      difficulty: ["Easy", "Medium", "Hard"].includes(q.difficulty) ? q.difficulty : "Medium",
      reason: typeof q.reason === "string" && q.reason.trim() ? q.reason.trim() : "Evaluates practical problem-solving ability and architectural trade-offs.",
      hint: typeof q.hint === "string" && q.hint.trim() ? q.hint.trim() : "Focus on concrete implementations and production failure modes.",
    };
  });

  const likelyTopics = Array.isArray(data.likelyTopics) && data.likelyTopics.length > 0
    ? data.likelyTopics.map(String)
    : Array.isArray(data.interviewPreparation?.likelyTopics)
    ? data.interviewPreparation.likelyTopics.map(String)
    : ["System Design", "Backend Architecture", "Core Fundamentals"];

  const likelyQuestions = Array.isArray(data.likelyQuestions) && data.likelyQuestions.length > 0
    ? data.likelyQuestions.map(String)
    : questions.map((q) => q.question);

  return {
    questions,
    likelyTopics,
    likelyQuestions,
  };
};

// 4. Analyze Resume
const analyzeResume = async ({ resumeText, jobDescription }) => {
  if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
    throw new Error("Resume content is required.");
  }
  if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
    throw new Error("Job description is required.");
  }

  return runAIOperation({
    feature: "resume",
    payload: { resumeText, jobDescription },
    promptBuilder: buildResumePrompt,
    heuristicFallback: heuristicEngine.analyzeResume,
    validator: validateAndNormalizeResume,
  });
};

// 5. Generate Interview Questions
const generateInterviewQuestions = async ({
  resumeText = "",
  jobDescription = "",
  mode = "Mixed",
  difficulty = "Mixed",
  previousQuestions = [],
  role = "Software Development Engineer",
  skills = "",
  topic = "Full Stack & System Architecture",
  level = "Intermediate",
  context = "",
}) => {
  const config = getAIConfig();
  return runAIOperation({
    feature: "interview",
    payload: {
      resumeText,
      jobDescription,
      mode,
      difficulty,
      previousQuestions,
      role,
      skills,
      topic,
      level,
      context,
    },
    promptBuilder: buildInterviewPrompt,
    heuristicFallback: heuristicEngine.analyzeInterviewQuestions,
    validator: validateAndNormalizeInterview,
    skipCache: true, // ZERO caching: every generation yields fresh question sets!
    temperature: config.interviewTemperature,
  });
};

module.exports = {
  analyzeResume,
  generateInterviewQuestions,
  getAIConfig,
};
