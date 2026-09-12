export function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
        styles[difficulty] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
    >
      {difficulty}
    </span>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    "Not Started": "bg-slate-800 text-slate-400 border-slate-700",
    Attempted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Solved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Need Revision": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
        styles[status] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export function PlatformBadge({ platform }) {
  const styles = {
    LeetCode: "bg-amber-600/10 text-amber-300 border-amber-600/20",
    Codeforces: "bg-red-600/10 text-red-300 border-red-600/20",
    CodeChef: "bg-amber-800/15 text-amber-200 border-amber-700/30",
    GeeksforGeeks: "bg-emerald-600/10 text-emerald-300 border-emerald-600/20",
    HackerRank: "bg-green-600/10 text-green-300 border-green-600/20",
    Other: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
        styles[platform] || "bg-slate-800 text-slate-300 border-slate-700"
      }`}
    >
      {platform}
    </span>
  );
}
