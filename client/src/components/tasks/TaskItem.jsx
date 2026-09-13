import { useState } from "react";
import TaskBadge from "./TaskBadge";
import TaskEditForm from "./TaskEditForm";

function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (event) => {
    onTaskUpdated(task._id, {
      status: event.target.value,
    });
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <TaskEditForm
          task={task}
          onTaskUpdated={onTaskUpdated}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#D5D1C6]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h3
            className={`text-sm font-bold ${
              task.status === "completed"
                ? "text-[#8E8B82] line-through"
                : "text-[#18181B]"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-[#575653] leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        <TaskBadge
          type="priority"
          value={task.priority}
        />
      </div>

      <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#F2F0E8] gap-4">
        <TaskBadge
          type="status"
          value={task.status}
        />

        <div className="flex items-center gap-3">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-xs px-2.5 py-1 rounded-md bg-[#FAF9F5] border border-[#E6E3DB] text-[#18181B] focus:outline-none focus:border-[#657858]"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-[#575653] hover:text-[#18181B]"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete this task?"
              );

              if (confirmed) {
                onTaskDeleted(task._id);
              }
            }}
            className="text-xs font-semibold text-[#933D3D] hover:text-[#7A2E2E]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;