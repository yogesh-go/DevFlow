import api from "./api";

export const getCurrentUser = () => {
  return api("/users/me");
};

export const updateProfile = (profileData) => {
  return api("/users/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
};
