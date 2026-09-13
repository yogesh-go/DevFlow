const badgeStyles = {
  todo: "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]",
  "in-progress": "bg-[#FAF4E8] text-[#865B20] border-[#EAD5AC]",
  completed: "bg-[#EDF4EE] text-[#426447] border-[#BCD4C2]",

  low: "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]",
  medium: "bg-[#FAF4E8] text-[#865B20] border-[#EAD5AC]",
  high: "bg-[#FBF0F0] text-[#933D3D] border-[#E8BFBF]",
};

function TaskBadge({ type, value }) {
  const style =
    badgeStyles[value] || "bg-[#F2F0E8] text-[#575653] border-[#E6E3DB]";

  const label = (value || "").replace("-", " ");

  return (
    <span
      className={`text-[11px] px-2.5 py-0.5 rounded-md border font-medium capitalize tracking-tight ${style}`}
    >
      {label}
    </span>
  );
}

export default TaskBadge;