import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  hasFilters,
  onTaskUpdated,
  onTaskDeleted,
}) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-dashed border-[#D5D1C6] rounded-xl p-8 text-center">
        <h3 className="text-sm font-bold text-[#18181B]">
          {hasFilters
            ? "No matching tasks"
            : "No tasks yet"}
        </h3>

        <p className="text-xs text-[#575653] mt-1">
          {hasFilters
            ? "Try changing your search or filters."
            : "Create your first task to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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