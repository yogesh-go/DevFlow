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
    <div className="grid md:grid-cols-4 gap-6 mt-10">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400 text-sm">
          Total Tasks
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {total}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400 text-sm">
          To Do
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {todo}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400 text-sm">
          In Progress
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {inProgress}
        </h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <p className="text-slate-400 text-sm">
          Completed
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {completed}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {completionPercentage}% complete
        </p>
      </div>
    </div>
  );
}

export default TaskStats;