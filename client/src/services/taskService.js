import api from "./api";

export const getTasks = (page = 1, limit = 10) => {
  return api(`/tasks?page=${page}&limit=${limit}`);
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