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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <TaskEditForm
          task={task}
          onTaskUpdated={onTaskUpdated}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`text-lg font-semibold ${
              task.status === "completed"
                ? "text-slate-500 line-through"
                : "text-white"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-slate-400 text-sm mt-1">
              {task.description}
            </p>
          )}
        </div>

        <TaskBadge
          type="priority"
          value={task.priority}
        />
      </div>

      <div className="flex items-center justify-between mt-5 gap-4">
        <TaskBadge
          type="status"
          value={task.status}
        />

        <div className="flex items-center gap-4">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-sm px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-400 hover:text-blue-300"
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
            className="text-sm text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;