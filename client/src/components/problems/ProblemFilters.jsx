import { Search, RotateCcw } from "lucide-react";

const PLATFORMS = [
  "all",
  "LeetCode",
  "Codeforces",
  "CodeChef",
  "GeeksforGeeks",
  "HackerRank",
  "Other",
];

const DIFFICULTIES = ["all", "Easy", "Medium", "Hard"];

const TOPICS = [
  "all",
  "Arrays",
  "Strings",
  "Two Pointers",
  "Sliding Window",
  "Linked List",
  "Stack",
  "Queue",
  "Trees",
  "Graphs",
  "DP",
  "Greedy",
  "Binary Search",
  "Backtracking",
  "Heap",
  "Trie",
  "Bit Manipulation",
  "Math",
  "Other",
];

const STATUSES = ["all", "Not Started", "Attempted", "Solved", "Need Revision"];

function ProblemFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const isFiltered =
    filters.search ||
    filters.difficulty !== "all" ||
    filters.topic !== "all" ||
    filters.platform !== "all" ||
    filters.status !== "all";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Search problems by title or keywords..."
          className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Filter Dropdowns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Topic
          </label>
          <select
            value={filters.topic || "all"}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Topics" : t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficulty || "all"}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Difficulties" : d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Platform
          </label>
          <select
            value={filters.platform || "all"}
            onChange={(e) => handleChange("platform", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Platforms" : p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
            Status
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
          <button
            type="button"
            onClick={onReset}
            disabled={!isFiltered}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemFilters;
