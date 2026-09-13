import { useState } from "react";
import Button from "../ui/Button";
import { createTask } from "../../services/taskService";

function TaskForm({ onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
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
      const data = await createTask(formData);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
      });
      onTaskCreated(data.task);
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E6E3DB] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
    >
      <h2 className="text-base font-bold text-[#18181B]">Add New Task</h2>

      {error && (
        <p className="mt-2 text-xs text-[#933D3D]">{error}</p>
      )}

      <div className="mt-4">
        <label className="block text-xs font-medium text-[#575653] mb-1.5">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Solve Two Sum"
          className="w-full px-3.5 py-2 rounded-lg bg-[#FAF9F5] border border-[#E6E3DB] text-xs text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 focus:border-[#657858]"
        />
      </div>

      <div className="mt-3.5">
        <label className="block text-xs font-medium text-[#575653] mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          placeholder="Add details..."
          className="w-full px-3.5 py-2 rounded-lg bg-[#FAF9F5] border border-[#E6E3DB] text-xs text-[#18181B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 focus:border-[#657858]"
        />
      </div>

      <div className="mt-3.5">
        <label className="block text-xs font-medium text-[#575653] mb-1.5">
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full px-3.5 py-2 rounded-lg bg-white border border-[#E6E3DB] text-xs text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#657858]/15 focus:border-[#657858]"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="sm"
        loading={loading}
        className="mt-4"
      >
        Add Task
      </Button>
    </form>
  );
}

export default TaskForm;