import api from "./api";

export const getGitHubProfile = (username) => {
  return api(`/github/${encodeURIComponent(username)}`);
};
