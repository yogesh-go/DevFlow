import api from "./api";

export const getRevisions = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return api(`/revision${queryString ? `?${queryString}` : ""}`);
};

export const scheduleRevision = (problemId, baseDate) => {
  return api("/revision", {
    method: "POST",
    body: JSON.stringify({ problemId, baseDate }),
  });
};

export const completeRevision = (revisionId, data = {}) => {
  return api(`/revision/${revisionId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};
