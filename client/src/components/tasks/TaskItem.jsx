import TaskBadge from "./TaskBadge";

function TaskItem({
  task,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const isCompleted = task.status === "completed";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className={`text-lg font-semibold ${
              isCompleted
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

      <div className="flex items-center justify-between mt-5">
        <TaskBadge
          type="status"
          value={task.status}
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              onTaskUpdated(task._id, {
                status: isCompleted
                  ? "todo"
                  : "completed",
              })
            }
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {isCompleted ? "Mark Todo" : "Complete"}
          </button>

          <button
            type="button"
            onClick={() => onTaskDeleted(task._id)}
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