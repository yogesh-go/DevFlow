import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import Button from "../ui/Button";

const PLATFORMS = [
  "LeetCode",
  "Codeforces",
  "CodeChef",
  "GeeksforGeeks",
  "HackerRank",
  "Other",
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const TOPICS = [
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

const STATUSES = ["Not Started", "Attempted", "Solved", "Need Revision"];

function ProblemModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: "",
    platform: "LeetCode",
    problemUrl: "",
    difficulty: "Medium",
    topic: "Arrays",
    status: "Not Started",
    timeTaken: 0,
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        platform: initialData.platform || "LeetCode",
        problemUrl: initialData.problemUrl || "",
        difficulty: initialData.difficulty || "Medium",
        topic: initialData.topic || "Arrays",
        status: initialData.status || "Not Started",
        timeTaken: initialData.timeTaken || 0,
        notes: initialData.notes || "",
      });
    } else {
      setFormData({
        title: "",
        platform: "LeetCode",
        problemUrl: "",
        difficulty: "Medium",
        topic: "Arrays",
        status: "Not Started",
        timeTaken: 0,
        notes: "",
      });
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "timeTaken" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Problem title is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save problem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-xl border border-[#E6E3DB] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#18181B] tracking-tight">
              {initialData ? "Edit Problem Entry" : "Add New Problem"}
            </h2>
            <p className="text-xs text-[#575653] mt-0.5">
              Record problem parameters, topic categorizations, and solution notes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#F2F0E8] hover:text-[#18181B] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-3 text-xs text-[#933D3D]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
              Problem Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Trapping Rain Water, LRU Cache"
              required
              className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3.5 py-2 text-sm text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E6E3DB] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Difficulty *
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E6E3DB] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Topic Category *
              </label>
              <select
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E6E3DB] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E6E3DB] bg-white px-3 py-2 text-xs text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Problem URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="problemUrl"
                  value={formData.problemUrl}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-2 text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 transition-all"
                />
                {formData.problemUrl && (
                  <a
                    href={formData.problemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-3 top-2.5 text-[#8E8B82] hover:text-[#18181B]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
                Time Taken (Minutes)
              </label>
              <input
                type="number"
                name="timeTaken"
                min="0"
                value={formData.timeTaken}
                onChange={handleChange}
                placeholder="30"
                className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-2 text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#575653] mb-1.5">
              Solution Approach & Notes (Markdown)
            </label>
            <textarea
              name="notes"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Key intuition, time & space complexity, edge cases..."
              className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 font-mono text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E6E3DB]">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              {initialData ? "Save Changes" : "Create Problem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProblemModal;
