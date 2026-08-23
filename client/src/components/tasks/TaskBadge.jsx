const badgeStyles = {
  todo: "bg-slate-800 text-slate-300",
  "in-progress": "bg-blue-500/10 text-blue-400",
  completed: "bg-green-500/10 text-green-400",

  low: "bg-slate-800 text-slate-300",
  medium: "bg-yellow-500/10 text-yellow-400",
  high: "bg-red-500/10 text-red-400",
};

function TaskBadge({ type, value }) {
  const style =
    badgeStyles[value] || "bg-slate-800 text-slate-300";

  const label = value.replace("-", " ");

  return (
    <span
      className={`text-xs px-3 py-1 rounded-full capitalize ${style}`}
    >
      {label}
    </span>
  );
}

export default TaskBadge;