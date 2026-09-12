import api from "./api";

export const getContests = () => {
  return api("/contests");
};
