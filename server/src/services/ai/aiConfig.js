/**
 * AI Provider & Model Configuration
 */

const getAIConfig = () => {
  const providerEnv = (process.env.AI_PROVIDER || "").toLowerCase().trim();
  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  let provider = "heuristic"; // Safe, deterministic default

  if (providerEnv === "openai" && openaiKey) {
    provider = "openai";
  } else if (providerEnv === "gemini" && geminiKey) {
    provider = "gemini";
  } else if (openaiKey) {
    provider = "openai";
  } else if (geminiKey) {
    provider = "gemini";
  }

  const model =
    process.env.AI_MODEL ||
    (provider === "openai"
      ? "gpt-4o-mini"
      : provider === "gemini"
      ? "gemini-1.5-flash"
      : "heuristic-v1");

  return {
    provider,
    model,
    hasExternalProvider: provider !== "heuristic",
    openaiKey,
    geminiKey,
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS, 10) || 15000,
    maxRetries: parseInt(process.env.AI_MAX_RETRIES, 10) || 2,
    interviewTemperature: parseFloat(process.env.AI_INTERVIEW_TEMPERATURE) || 0.8,
  };
};

module.exports = {
  getAIConfig,
};
