import { useState, useEffect } from "react";
import {
  BarChart3,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  Repeat,
  Calendar,
  Layers,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getAnalytics } from "../services/analyticsService";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setData(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner message="Calculating real-time analytics from database..." />
      </div>
    );
  }

  if (!data) return null;

  const { overview, difficulty, topics, platforms, weeklyActivity, revisions } = data;

  const maxWeeklyCount = Math.max(
    ...(weeklyActivity?.map((w) => w.solvedCount) || [1]),
    1
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Performance & Growth Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real database metrics analyzing your DSA mastery, consistency, and revision accuracy.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Solved</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            {overview.solvedProblems}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            out of {overview.totalProblems} tracked problems
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Current Streak</span>
            <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-amber-400 mt-3">
            {overview.currentStreak} <span className="text-base font-normal text-slate-400">days</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Longest streak: {overview.longestStreak} days
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Success Rate</span>
            <TrendingUp className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-blue-400 mt-3">
            {overview.successRate}%
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {overview.attemptedProblems} in progress / attempted
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Revision Accuracy</span>
            <Repeat className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-purple-400 mt-3">
            {revisions.completionRate}%
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {revisions.completedRevisions} of {revisions.totalRevisions} revisions done
          </p>
        </div>
      </div>

      {/* Grid: Difficulty Distribution & Weekly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Difficulty Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              Problems by Difficulty
            </h3>
            <span className="text-xs text-slate-400">Target Distribution</span>
          </div>

          <div className="space-y-4">
            {["Easy", "Medium", "Hard"].map((diff) => {
              const stat = difficulty[diff] || { total: 0, solved: 0 };
              const percent = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
              const barColor =
                diff === "Easy"
                  ? "bg-emerald-500"
                  : diff === "Medium"
                  ? "bg-amber-500"
                  : "bg-rose-500";

              return (
                <div key={diff} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{diff}</span>
                    <span className="text-slate-400">
                      {stat.solved} / {stat.total} solved ({percent}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              7-Day Activity & Solves
            </h3>
            <span className="text-xs text-slate-400">Problems solved per day</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {weeklyActivity?.map((item) => {
              const heightPercent =
                maxWeeklyCount > 0
                  ? Math.max(Math.round((item.solvedCount / maxWeeklyCount) * 100), 10)
                  : 10;

              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-[11px] font-semibold text-blue-400">
                    {item.solvedCount}
                  </span>
                  <div className="w-full max-w-[28px] bg-slate-800 rounded-t-md h-28 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-blue-600 hover:bg-blue-500 transition-all rounded-t-md"
                      style={{ height: `${item.solvedCount > 0 ? heightPercent : 0}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Topic Mastery Breakdown */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Topic Mastery & Coverage
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown of solved problems across key interview DSA categories.
            </p>
          </div>
          <Layers className="h-5 w-5 text-slate-400" />
        </div>

        {topics?.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            No topic data available yet. Start logging problems to visualize topic mastery.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topics.map((t) => {
              const percent = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
              return (
                <div
                  key={t.topic}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{t.topic}</span>
                    <span className="text-slate-400">
                      {t.solved} / {t.total} ({percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
