import api from "./api";

export const getAnalytics = () => {
  return api("/analytics");
};
