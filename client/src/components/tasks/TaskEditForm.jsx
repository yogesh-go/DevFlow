import { useState } from "react";
import Button from "../ui/Button";

function TaskEditForm({
  task,
  onTaskUpdated,
  onCancel,
}) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
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
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#FAF9F5] border border-[#E6E3DB] rounded-lg p-4 space-y-3"
    >
      {error && (
        <p className="text-xs text-[#933D3D]">{error}</p>
      )}

      <div>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-1.5 rounded-md bg-white border border-[#E6E3DB] text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
        />
      </div>

      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-1.5 rounded-md bg-white border border-[#E6E3DB] text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#657858]/15"
        />
      </div>

      <div className="flex gap-2">
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-1/2 px-2.5 py-1.5 rounded-md bg-white border border-[#E6E3DB] text-xs text-[#18181B]"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-1/2 px-2.5 py-1.5 rounded-md bg-white border border-[#E6E3DB] text-xs text-[#18181B]"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="xs"
          loading={loading}
        >
          Save
        </Button>
      </div>
    </form>
  );
}

export default TaskEditForm;