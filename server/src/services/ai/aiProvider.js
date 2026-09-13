/**
 * Resilient AI Provider Client (OpenAI & Gemini)
 * Handles timeouts, exponential backoff retries, and robust JSON extraction.
 */

const extractJson = (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Empty response received from AI provider");
  }

  // 1. Strip markdown code fences if present
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
  cleaned = cleaned.replace(/\s*```$/i, "");
  cleaned = cleaned.trim();

  // 2. Direct parse attempt
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // 3. Fallback: Locate outermost JSON structure
    const startObj = cleaned.indexOf("{");
    const endObj = cleaned.lastIndexOf("}");
    if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
      try {
        return JSON.parse(cleaned.substring(startObj, endObj + 1));
      } catch (err2) {
        // Continue
      }
    }

    const startArr = cleaned.indexOf("[");
    const endArr = cleaned.lastIndexOf("]");
    if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
      try {
        return JSON.parse(cleaned.substring(startArr, endArr + 1));
      } catch (err3) {
        // Continue
      }
    }

    throw new Error(`AI returned malformed JSON: ${err1.message}`);
  }
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callOpenAI = async ({ system, prompt, config, temperature = 0.2 }) => {
  const url = "https://api.openai.com/v1/chat/completions";
  let lastError = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 4000);
        await wait(backoffMs);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openaiKey}`,
        },
        body: JSON.stringify({
          model: config.model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: typeof temperature === "number" ? temperature : 0.2,
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        // Do not retry 401 or 400
        if (response.status === 401 || response.status === 400) {
          const err = new Error(`OpenAI Authentication / Request error: ${response.status}`);
          err.statusCode = response.status;
          throw err;
        }

        // Retry on 429 or 5xx
        throw new Error(`OpenAI API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      return extractJson(content);
    } catch (err) {
      lastError = err;
      if (err.name === "AbortError") {
        lastError = new Error(`AI request timed out after ${config.timeoutMs}ms`);
      }
      if (err.statusCode === 401 || err.statusCode === 400) {
        throw lastError;
      }
    }
  }

  throw lastError;
};

const callGemini = async ({ system, prompt, config, temperature = 0.2 }) => {
  const modelName = config.model.includes("gemini") ? config.model : "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.geminiKey}`;
  let lastError = null;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 4000);
        await wait(backoffMs);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: typeof temperature === "number" ? temperature : 0.2,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 400 || response.status === 403) {
          const err = new Error(`Gemini API client error: ${response.status}`);
          err.statusCode = response.status;
          throw err;
        }
        throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return extractJson(rawText);
    } catch (err) {
      lastError = err;
      if (err.name === "AbortError") {
        lastError = new Error(`AI request timed out after ${config.timeoutMs}ms`);
      }
      if (err.statusCode === 400 || err.statusCode === 403) {
        throw lastError;
      }
    }
  }

  throw lastError;
};

const executeAIRequest = async ({ system, prompt, config, temperature }) => {
  if (config.provider === "openai") {
    return await callOpenAI({ system, prompt, config, temperature });
  } else if (config.provider === "gemini") {
    return await callGemini({ system, prompt, config, temperature });
  }
  throw new Error(`Unsupported external AI provider: ${config.provider}`);
};

module.exports = {
  executeAIRequest,
  extractJson,
};
