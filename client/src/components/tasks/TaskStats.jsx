function TaskStats({ tasks }) {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const todo = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const completionPercentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[#8E8B82] text-xs uppercase font-medium">
          Total Tasks
        </p>

        <h2 className="text-2xl font-bold text-[#18181B] mt-1">
          {total}
        </h2>
      </div>

      <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[#8E8B82] text-xs uppercase font-medium">
          To Do
        </p>

        <h2 className="text-2xl font-bold text-[#18181B] mt-1">
          {todo}
        </h2>
      </div>

      <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[#8E8B82] text-xs uppercase font-medium">
          In Progress
        </p>

        <h2 className="text-2xl font-bold text-[#865B20] mt-1">
          {inProgress}
        </h2>
      </div>

      <div className="bg-white border border-[#E6E3DB] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <p className="text-[#8E8B82] text-xs uppercase font-medium">
          Completed
        </p>

        <h2 className="text-2xl font-bold text-[#426447] mt-1">
          {completed}
        </h2>

        <p className="text-[11px] text-[#8E8B82] mt-0.5">
          {completionPercentage}% complete
        </p>
      </div>
    </div>
  );
}

export default TaskStats;