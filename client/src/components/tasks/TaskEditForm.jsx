import { useState } from "react";

function TaskEditForm({
  task,
  onTaskUpdated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onTaskUpdated(task._id, formData);
      onCancel();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows="3"
        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskEditForm;