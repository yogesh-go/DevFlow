import api from "./api";

export const getTasks = () => {
  return api("/tasks");
};

export const createTask = (taskData) => {
  return api("/tasks", {
    method: "POST",
    body: JSON.stringify(taskData),
  });
};

export const updateTask = (taskId, taskData) => {
  return api(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = (taskId) => {
  return api(`/tasks/${taskId}`, {
    method: "DELETE",
  });
};