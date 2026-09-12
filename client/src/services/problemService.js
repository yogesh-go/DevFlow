import api from "./api";

export const getProblems = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return api(`/problems${queryString ? `?${queryString}` : ""}`);
};

export const getProblemById = (id) => {
  return api(`/problems/${id}`);
};

export const createProblem = (problemData) => {
  return api("/problems", {
    method: "POST",
    body: JSON.stringify(problemData),
  });
};

export const updateProblem = (id, problemData) => {
  return api(`/problems/${id}`, {
    method: "PUT",
    body: JSON.stringify(problemData),
  });
};

export const deleteProblem = (id) => {
  return api(`/problems/${id}`, {
    method: "DELETE",
  });
};
