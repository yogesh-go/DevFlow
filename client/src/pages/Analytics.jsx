import { useState, useEffect } from "react";
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  Repeat,
  Calendar,
  Layers,
  RefreshCw,
  Award,
  BarChart3,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
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

  useEffect(() => {
    const handleProblemCreated = () => {
      fetchAnalytics();
    };

    window.addEventListener("devflow:problem-created", handleProblemCreated);
    return () => {
      window.removeEventListener("devflow:problem-created", handleProblemCreated);
    };
  }, []);

  const handleOpenAddProblem = () => {
    window.dispatchEvent(new CustomEvent("devflow:open-problem-modal"));
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-[#EAE7DF]" />
            <div className="h-8 w-56 rounded bg-[#EAE7DF]" />
            <div className="h-4 w-72 rounded bg-[#EAE7DF]" />
          </div>
          <div className="h-8 w-24 rounded bg-[#EAE7DF]" />
        </div>

        {/* KPI Strip Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-b border-[#E6E3DB]/80 pb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 rounded bg-[#EAE7DF]" />
              <div className="h-8 w-24 rounded bg-[#EAE7DF]" />
              <div className="h-3 w-32 rounded bg-[#EAE7DF]" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 h-56 space-y-3">
            <div className="h-4 w-40 rounded bg-[#EAE7DF]" />
            <div className="h-36 rounded bg-[#FAF9F5]" />
          </div>
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 h-56 space-y-3">
            <div className="h-4 w-40 rounded bg-[#EAE7DF]" />
            <div className="h-36 rounded bg-[#FAF9F5]" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, difficulty, topics, platforms, weeklyActivity, revisions } = data;

  const hasData = overview.totalProblems > 0;

  const maxWeeklyCount = Math.max(
    ...(weeklyActivity?.map((w) => w.solvedCount) || [1]),
    1
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            Database Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Analytics & Progress
          </h1>
          <p className="text-xs sm:text-sm text-[#575653]">
            Verified metrics analyzing problem solve velocity, consistency streaks, and topic coverage.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchAnalytics}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* KPI Overview Strip (Zero Misleading Defaults) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-b border-[#E6E3DB]/80 pb-8">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Total Solved
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight mt-1.5">
            {!hasData ? "—" : overview.solvedProblems}
          </p>
          <p className="text-xs text-[#575653] mt-1">
            {!hasData ? "No problems tracked yet" : `out of ${overview.totalProblems} tracked`}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Current Streak
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#865B20] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            {overview.currentStreak === 0 ? (
              <span>—</span>
            ) : (
              <>
                <span>{overview.currentStreak}</span>
                <span className="text-base font-normal text-[#8E8B82]">days</span>
              </>
            )}
          </p>
          <p className="text-xs text-[#575653] mt-1">
            {overview.currentStreak === 0
              ? "Start solving to build your streak"
              : `Longest record: ${overview.longestStreak || overview.currentStreak} days`}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Success Rate
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            {!hasData ? (
              <span>—</span>
            ) : (
              <>
                <span>{overview.successRate}%</span>
              </>
            )}
          </p>
          <p className="text-xs text-[#575653] mt-1">
            {!hasData
              ? "No completion data"
              : `${overview.attemptedProblems || 0} currently attempted`}
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Revision Accuracy
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#657858] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            {!hasData || revisions.totalRevisions === 0 ? (
              <span>—</span>
            ) : (
              <>
                <span>{revisions.completionRate}%</span>
              </>
            )}
          </p>
          <p className="text-xs text-[#575653] mt-1">
            {!hasData || revisions.totalRevisions === 0
              ? "No revisions scheduled"
              : `${revisions.completedRevisions} of ${revisions.totalRevisions} reviews done`}
          </p>
        </div>
      </div>

      {/* When no problems exist in workspace, render clear empty state */}
      {!hasData ? (
        <div className="rounded-xl border border-dashed border-[#D5D1C6] bg-white p-12 text-center space-y-3">
          <BarChart3 className="h-10 w-10 text-[#8E8B82] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#18181B]">
            No activity yet
          </h3>
          <p className="text-xs text-[#575653] max-w-md mx-auto">
            Solve and track your first algorithmic problem in your workspace to generate real, verified database analytics across weekly consistency, difficulty distribution, and topic mastery.
          </p>
          <Button variant="primary" size="sm" onClick={handleOpenAddProblem}>
            <Plus className="h-4 w-4" />
            <span>Add First Problem</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Grid: Weekly Consistency Chart & Difficulty Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Consistency Bar Chart */}
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#18181B]">
                    7-Day Solve Consistency
                  </h3>
                  <p className="text-xs text-[#575653]">
                    Problems solved per day across the past week.
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-[#8E8B82]" />
              </div>

              <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
                {weeklyActivity?.map((item) => {
                  const heightPercent =
                    maxWeeklyCount > 0
                      ? Math.max(Math.round((item.solvedCount / maxWeeklyCount) * 100), 8)
                      : 8;

                  return (
                    <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#657858]">
                        {item.solvedCount}
                      </span>
                      <div className="w-full max-w-[32px] bg-[#F2F0E8] rounded-t-md h-28 flex items-end overflow-hidden">
                        <div
                          className="w-full bg-[#657858] hover:bg-[#4E5D44] transition-all rounded-t-md"
                          style={{ height: `${item.solvedCount > 0 ? heightPercent : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-[#8E8B82]">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Breakdown */}
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#18181B]">
                    Difficulty Breakdown
                  </h3>
                  <p className="text-xs text-[#575653]">
                    Distribution of attempted vs solved problems.
                  </p>
                </div>
                <Award className="h-4 w-4 text-[#8E8B82]" />
              </div>

              <div className="space-y-4 pt-2">
                {["Easy", "Medium", "Hard"].map((diff) => {
                  const stat = difficulty[diff] || { total: 0, solved: 0 };
                  const percent = stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0;
                  const barColor =
                    diff === "Easy"
                      ? "bg-[#657858]"
                      : diff === "Medium"
                      ? "bg-[#865B20]"
                      : "bg-[#933D3D]";

                  return (
                    <div key={diff} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#18181B]">{diff}</span>
                        <span className="text-[#8E8B82]">
                          {stat.solved} / {stat.total} solved ({percent}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[#EAE7DF] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topic Coverage & Mastery Breakdown */}
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#18181B]">
                  Topic Performance & Coverage
                </h3>
                <p className="text-xs text-[#575653]">
                  Breakdown of solved problems across key algorithmic topics.
                </p>
              </div>
              <Layers className="h-4 w-4 text-[#8E8B82]" />
            </div>

            {topics?.length === 0 ? (
              <p className="text-xs text-[#8E8B82] text-center py-6">
                No topic data available yet. Solve problems to visualize topic coverage.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
                {topics.map((t) => {
                  const percent = t.total > 0 ? Math.round((t.solved / t.total) * 100) : 0;
                  return (
                    <div
                      key={t.topic}
                      className="rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 space-y-2 hover:border-[#D5D1C6] transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#18181B]">{t.topic}</span>
                        <span className="text-[#8E8B82]">
                          {t.solved} / {t.total} ({percent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#EAE7DF] overflow-hidden">
                        <div
                          className="h-full bg-[#657858] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Platform Breakdown */}
          {platforms?.length > 0 && (
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-sm font-bold text-[#18181B]">
                Platform Distribution
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {platforms.map((p) => (
                  <span
                    key={p.platform}
                    className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-1 text-xs text-[#575653] font-medium"
                  >
                    <span className="font-semibold text-[#18181B]">{p.platform}</span>:{" "}
                    {p.count} problems
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;
