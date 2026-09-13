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
    <div className="bg-white border border-[#E6E3DB] rounded-xl p-5 mt-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xs font-bold text-[#18181B]">
            Overall Progress
          </h3>

          <p className="text-[11px] text-[#575653] mt-0.5">
            {completed} of {total} tasks completed
          </p>
        </div>

        <span className="text-xs font-bold text-[#657858]">
          {percentage}%
        </span>
      </div>

      <div className="w-full h-2 bg-[#EAE7DF] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#657858] rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default TaskProgress;