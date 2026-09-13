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
    <div className="rounded-xl border border-[#E6E3DB] bg-white p-4 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => handleChange("search", e.target.value)}
          placeholder="Search problems by title, keywords, or patterns..."
          className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] py-2 pl-10 pr-4 text-xs text-[#18181B] placeholder-[#8E8B82] outline-none transition-all focus:border-[#657858] focus:bg-white focus:ring-2 focus:ring-[#657858]/15"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] mb-1">
            Topic
          </label>
          <select
            value={filters.topic || "all"}
            onChange={(e) => handleChange("topic", e.target.value)}
            className="w-full rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Topics" : t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficulty || "all"}
            onChange={(e) => handleChange("difficulty", e.target.value)}
            className="w-full rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d === "all" ? "All Difficulties" : d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] mb-1">
            Platform
          </label>
          <select
            value={filters.platform || "all"}
            onChange={(e) => handleChange("platform", e.target.value)}
            className="w-full rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Platforms" : p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82] mb-1">
            Status
          </label>
          <select
            value={filters.status || "all"}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1.5 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
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
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-1.5 text-xs font-medium text-[#575653] hover:bg-white hover:text-[#18181B] hover:border-[#D5D1C6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProblemFilters;
