/**
 * Feature-Specific AI Prompts & Strict JSON Schemas
 * SDE Interview Standard
 */

const SYSTEM_INSTRUCTION = `You are an elite Staff Software Engineer and Senior Technical Interviewer.
You analyze software code, algorithms, and developer profiles with rigor, precision, and zero fluff.
CRITICAL RULES:
1. Always output ONLY valid JSON matching the exact requested JSON schema.
2. Do NOT include markdown code fences like \`\`\`json or \`\`\`. Output raw, parseable JSON only.
3. Be technically accurate: do not invent behavior not present in the input. If something cannot be determined, explicitly state it.
4. For resume and interview analysis, provide deep, actionable technical insights.`;

const buildResumePrompt = ({ resumeText, jobDescription }) => {
  return {
    system: SYSTEM_INSTRUCTION,
    prompt: `Perform an in-depth, rigorous ATS and technical evaluation of the following Software Engineer Resume specifically compared against the provided Job Description.

JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE RESUME:
"""
${resumeText}
"""

CRITICAL RESUME ANALYSIS RULES:
1. The AI must analyze the resume specifically against the provided job description. Do NOT evaluate the resume in isolation.
2. Ground truth analysis only: Do NOT invent experience, skills, projects, certifications, achievements, companies, or technologies that are not present in the resume.
3. Clearly distinguish between:
   - Present in resume: Explicitly verified in the candidate's text.
   - Required by JD: Mentioned in the job posting requirements or preferred qualifications.
   - Missing from resume: Required or preferred by the JD but completely absent from the resume.
   - Partially demonstrated: Related skills or implied exposure without concrete evidence of depth.
   Example: If the JD asks for "React, Node.js, MongoDB and REST APIs" and the resume says "Built full-stack applications using React and Node.js", report React and Node.js as matched, and MongoDB and REST APIs as missing / not demonstrated. Do NOT assume the candidate knows MongoDB just because they know Node.js.
4. Meaningful, justified scoring: Create a meaningful score (0-100) instead of randomly assigning a number. Consider required skills match, preferred skills match, relevant experience, relevant projects, technical stack alignment, JD keywords, ATS-friendly structure, and evidence of impact. Explain WHY the scores were given.
5. Actionable improvements: Each recommendation must specify priority ("high", "medium", or "low"), section ("Experience", "Projects", "Skills", "Summary", "Education", or "Other"), the specific problem observed, an actionable recommendation, and a realistic example. Never fabricate metrics. If a recommendation requires information that is not available, explicitly say that the user should add it only if it is true.
6. ATS Compatibility: Check for important JD keywords, standard section names, skill alignment, excessive keyword stuffing, missing role-specific terminology, and poor evidence of impact.
7. Interview Preparation: Formulate likely technical topics and realistic interview questions based on information actually found in the resume and job description, including potential weak areas the interviewer may probe.

Return a JSON object strictly following this structure:
{
  "overallScore": 76,
  "summary": "Crisp 2-3 sentence executive summary assessing the candidate's alignment with this specific role.",
  "jobMatch": {
    "score": 80,
    "explanation": "Detailed justification of the job match score based on core technical stack alignment and requirements."
  },
  "atsCompatibility": {
    "score": 72,
    "issues": [
      "Specific ATS parsing risk, non-standard section heading, or formatting hurdle"
    ],
    "recommendations": [
      "Concrete ATS formatting or structural recommendation"
    ]
  },
  "skillsAnalysis": {
    "matched": [
      "Skill explicitly required by JD and verified in resume"
    ],
    "missing": [
      "Skill required by JD but absent from resume"
    ],
    "partiallyMatched": [
      "Related technology present without full depth evidence"
    ]
  },
  "experienceAnalysis": {
    "strengths": [
      "Demonstrated work or project experience matching role expectations"
    ],
    "gaps": [
      "Experience or domain gaps compared against JD expectations"
    ]
  },
  "keywordAnalysis": {
    "importantKeywords": [
      "High-value domain keyword found in both texts"
    ],
    "missingKeywords": [
      "Critical JD keyword missing from candidate text"
    ],
    "overusedKeywords": [
      "Generic buzzwords lacking supporting metrics"
    ]
  },
  "resumeStrengths": [
    "Key competitive advantages demonstrated in the resume"
  ],
  "resumeWeaknesses": [
    "Vulnerabilities or weak bullet points in the resume"
  ],
  "improvements": [
    {
      "priority": "high",
      "section": "Projects",
      "problem": "Specific observed issue in the resume section",
      "recommendation": "Actionable instruction on how to elevate the content if truthful",
      "example": "Concrete example of an improved bullet point"
    }
  ],
  "projectRecommendations": [
    "Standout production-grade project idea tailored to bridge missing JD stack gaps"
  ],
  "actionPlan": [
    "Immediate prioritized next steps to tailor this resume for this job"
  ],
  "interviewPreparation": {
    "likelyTopics": [
      "Core technical topic or system design area likely to be tested"
    ],
    "likelyQuestions": [
      "Realistic interview question based on resume claims or potential weak areas"
    ]
  }
}`,
  };
};

const buildInterviewPrompt = ({
  resumeText = "",
  jobDescription = "",
  role = "Software Development Engineer",
  skills = "",
  topic = "Full Stack & System Architecture",
  level = "Intermediate",
  context = "",
  mode = "Mixed",
  difficulty = "Mixed",
  previousQuestions = [],
}) => {
  const previousListText =
    Array.isArray(previousQuestions) && previousQuestions.length > 0
      ? previousQuestions.slice(-25).map((q, idx) => `${idx + 1}. "${q}"`).join("\n")
      : "None";

  const modeInstructions = {
    "Mixed": "Produce a well-balanced distribution across technical fundamentals, resume-specific claims, project deep-dives, system architecture, scenario problem-solving, and behavioral engineering situations.",
    "Technical": "Focus heavily on technical fundamentals, language internals, execution mechanics, algorithms, and debugging scenarios.",
    "Resume Based": "Focus heavily on specific technologies, frameworks, systems, metrics, and experience claims actually present in the candidate's resume.",
    "Project Based": "Deep-dive into architectural decisions, technical trade-offs, database choices, error boundaries, and end-to-end implementation of projects mentioned.",
    "Behavioral": "Focus on engineering leadership, cross-functional trade-offs, resolving technical disagreements, handling production outages, and delivery under pressure.",
    "System Design": "Focus on high-level architecture, microservices decomposition, data storage trade-offs, distributed caching, throughput scaling, and failure isolation appropriate for the role level.",
    "Rapid Fire": "Generate crisp, high-yield technical screener questions testing conceptual precision and fundamental knowledge.",
  };

  const difficultyInstruction =
    difficulty === "Easy"
      ? "Calibrate all questions to Junior/Associate SDE level (foundational concepts, direct syntax, standard idioms)."
      : difficulty === "Hard"
      ? "Calibrate all questions to Senior/Staff SDE level (subtle edge cases, concurrency hazards, distributed failure modes, scaling trade-offs)."
      : difficulty === "Medium"
      ? "Calibrate all questions to Mid-Level SDE (practical implementation, architectural reasoning, optimization, trade-offs)."
      : "Provide a natural progression across Easy (20%), Medium (60%), and Hard (20%) difficulty.";

  return {
    system: `${SYSTEM_INSTRUCTION}

You are an expert technical interviewer and Principal Bar Raiser conducting an interview loop for an SDE position.
Generate a fresh, dynamic, and rigorous set of 12 to 15 technical interview questions.`,
    prompt: `==================================================
INTERVIEW TARGET SPECIFICATION
==================================================
Target Role: ${role || "Software Development Engineer"}
Seniority Level: ${level || "Intermediate"}
Interview Mode: ${mode} (${modeInstructions[mode] || modeInstructions["Mixed"]})
Difficulty Target: ${difficulty} (${difficultyInstruction})
${topic ? `Focus Topic: ${topic}` : ""}
${skills ? `Skills / Core Stack: ${skills}` : ""}

==================================================
CANDIDATE RESUME TEXT
==================================================
${resumeText ? resumeText.trim() : "Not provided directly (refer to skills & context)."}

==================================================
TARGET JOB DESCRIPTION
==================================================
${jobDescription ? jobDescription.trim() : "Standard SDE expectations for modern web & distributed services."}

${context ? `Additional Context: ${context}` : ""}

==================================================
ANTI-DUPLICATION EXCLUSION LIST
==================================================
The candidate has recently been asked the following questions.
DO NOT repeat, rephrase, or ask near-duplicates of any of these questions:
${previousListText}

==================================================
CORE REQUIREMENTS FOR QUESTION GENERATION
==================================================
1. COUNT: Return exactly 12 to 15 questions.
2. DYNAMIC VARIATION: Avoid generic definition questions like "What is React?" or "What is MongoDB?".
   Instead, test architectural depth, trade-offs, security, failure scenarios, and implementation mechanics:
   - Instead of "What is JWT?", ask "How would you safely handle JWT token revocation before expiration in a distributed microservices cluster?"
   - Instead of "What is Redis?", ask "How would you mitigate cache stampede (thundering herd) when high-traffic Redis keys expire?"
3. FACTUAL GROUNDING: Strictly ground resume-specific and project-based questions in the provided resume text. Never hallucinate projects, certifications, or companies the candidate did not mention.
4. ORDERING: Do NOT follow a fixed pattern or predictable sequence. Randomize category distribution across the set.
5. REASON: For each question, explain "Why they're asking" (the core engineering competency being evaluated).
6. HINT: Provide a concise architectural/technical hint detailing key points or trade-offs a top candidate should mention.

==================================================
REQUIRED JSON OUTPUT FORMAT
==================================================
Return ONLY valid JSON matching this exact structure:
{
  "interviewPreparation": {
    "questions": [
      {
        "question": "Clear, articulated interview question",
        "category": "Technical | Resume Based | Project Based | Behavioral | System Design | Scenario | Architecture | Debugging",
        "difficulty": "Easy | Medium | Hard",
        "reason": "Why the interviewer is asking this question (evaluates...",
        "hint": "Key technical points or architectural trade-offs to articulate"
      }
    ]
  }
}`,
  };
};

module.exports = {
  buildResumePrompt,
  buildInterviewPrompt,
};
