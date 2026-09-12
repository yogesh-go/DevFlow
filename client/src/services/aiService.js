import api from "./api";

export const explainCode = (language, code) => {
  return api("/ai/explain", {
    method: "POST",
    body: JSON.stringify({ language, code }),
  });
};

export const optimizeCode = (language, code) => {
  return api("/ai/optimize", {
    method: "POST",
    body: JSON.stringify({ language, code }),
  });
};

export const generateNotes = (data) => {
  return api("/ai/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const analyzeResume = (resumeText) => {
  return api("/ai/resume", {
    method: "POST",
    body: JSON.stringify({ resumeText }),
  });
};

export const generateInterviewQuestions = (topic, level) => {
  return api("/ai/interview", {
    method: "POST",
    body: JSON.stringify({ topic, level }),
  });
};
