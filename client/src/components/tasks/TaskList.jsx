import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  hasFilters,
  onTaskUpdated,
  onTaskDeleted,
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
        <h3 className="text-white font-semibold">
          {hasFilters
            ? "No matching tasks"
            : "No tasks yet"}
        </h3>

        <p className="text-slate-400 text-sm mt-2">
          {hasFilters
            ? "Try changing your search or filters."
            : "Create your first task to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onTaskUpdated={onTaskUpdated}
          onTaskDeleted={onTaskDeleted}
        />
      ))}
    </div>
  );
}

export default TaskList;