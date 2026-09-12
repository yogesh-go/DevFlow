import api from "./api";

export const getNotes = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return api(`/notes${queryString ? `?${queryString}` : ""}`);
};

export const getNoteById = (id) => {
  return api(`/notes/${id}`);
};

export const createNote = (noteData) => {
  return api("/notes", {
    method: "POST",
    body: JSON.stringify(noteData),
  });
};

export const updateNote = (id, noteData) => {
  return api(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(noteData),
  });
};

export const deleteNote = (id) => {
  return api(`/notes/${id}`, {
    method: "DELETE",
  });
};
