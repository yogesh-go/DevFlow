import api from "./api";

export const getAIStatus = () => {
  return api("/ai/status");
};

export const analyzeResume = ({ resumeText, jobDescription }) => {
  return api("/ai/resume", {
    method: "POST",
    body: JSON.stringify({ resumeText, jobDescription }),
  });
};

export const generateInterviewQuestions = ({
  role = "Software Development Engineer",
  skills = "",
  topic = "Full Stack & System Architecture",
  level = "Intermediate",
  context = "",
  resumeText = "",
  jobDescription = "",
  mode = "Mixed",
  difficulty = "Mixed",
  previousQuestions = [],
}) => {
  return api("/ai/interview", {
    method: "POST",
    body: JSON.stringify({
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
    }),
  });
};

export const getProfileAIContext = () => {
  return api("/ai/profile-context");
};
