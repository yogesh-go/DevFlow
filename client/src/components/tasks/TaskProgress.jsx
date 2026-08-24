function TaskProgress({ tasks }) {
  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const percentage =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold">
            Overall Progress
          </h3>

          <p className="text-sm text-slate-400 mt-1">
            {completed} of {total} tasks completed
          </p>
        </div>

        <span className="text-blue-400 font-semibold">
          {percentage}%
        </span>
      </div>

      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default TaskProgress;