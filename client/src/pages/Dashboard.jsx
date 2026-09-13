import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  CheckCircle2,
  Repeat,
  Sparkles,
  Plus,
  ArrowRight,
  Code2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getAnalytics } from "../services/analyticsService";
import { getRevisions, completeRevision } from "../services/revisionService";
import { getProblems } from "../services/problemService";
import { DifficultyBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ActivityHeatmap from "../components/ui/ActivityHeatmap";
import EmptyState from "../components/ui/EmptyState";

function Dashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsRes, revRes, probRes] = await Promise.all([
        getAnalytics(),
        getRevisions(),
        getProblems({ limit: 6, sortBy: "createdAt", sortOrder: "desc" }),
      ]);

      setAnalytics(analyticsRes.data);
      setRevisions(revRes.today || []);
      setRecentProblems(probRes.problems || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCompleteRevision = async (revId) => {
    try {
      await completeRevision(revId, { confidence: "high" });
      toast.success("Revision completed!");
      loadDashboardData();
    } catch (err) {
      toast.error(err.message || "Failed to complete revision");
    }
  };

  const handleOpenAddProblem = () => {
    window.dispatchEvent(new CustomEvent("devflow:open-problem-modal"));
  };

  // Compute greeting according to current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <LoadingSpinner message="Assembling your developer workspace..." />
      </div>
    );
  }

  const overview = analytics?.overview || {
    totalProblems: 0,
    solvedProblems: 0,
    currentStreak: 0,
    successRate: 0,
  };

  const difficulty = analytics?.difficulty || {
    Easy: { total: 0, solved: 0 },
    Medium: { total: 0, solved: 0 },
    Hard: { total: 0, solved: 0 },
  };

  const weeklyActivity = analytics?.weeklyActivity || [];
  const weeklySolveCount = weeklyActivity.reduce(
    (acc, w) => acc + (w.solvedCount || 0),
    0
  );

  const developerName = user?.name ? user.name.split(" ")[0] : "Developer";

  return (
    <div className="space-y-8">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#E6E3DB] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#657858] tracking-wider uppercase">
            <span>Developer Command Center</span>
            <span className="text-[#8E8B82]">·</span>
            <span className="text-[#8E8B82] font-normal lowercase">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#18181B]">
            {getGreeting()}, {developerName}.
          </h1>

          <p className="text-sm text-[#575653] pt-0.5">
            {revisions.length > 0
              ? `Your consistency is improving. You have ${revisions.length} ${
                  revisions.length === 1 ? "revision" : "revisions"
                } scheduled today.`
              : "Your consistency is improving. All scheduled revisions for today are complete."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAddProblem}
            className="shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add Problem</span>
          </Button>

          <Link to="/ai-tools">
            <Button variant="secondary" size="sm">
              <Sparkles className="h-3.5 w-3.5 text-[#657858]" />
              <span>AI Studio</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-[#E8BFBF] bg-[#FBF0F0] p-4 text-xs text-[#933D3D] flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. TYPOGRAPHIC METRICS STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-2 border-b border-[#E6E3DB]/80 pb-8">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Problems Solved
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight mt-1.5">
            {overview.solvedProblems}
          </p>
          <p className="text-xs text-[#575653] mt-1">
            {overview.totalProblems} tracked in workspace
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Current Streak
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#865B20] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            <span>{overview.currentStreak}</span>
            <span className="text-base font-normal text-[#8E8B82]">days</span>
          </p>
          <p className="text-xs text-[#575653] mt-1">
            Longest record: {overview.longestStreak || overview.currentStreak} days
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            This Week
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            <span>{weeklySolveCount}</span>
            <span className="text-base font-normal text-[#8E8B82]">solves</span>
          </p>
          <p className="text-xs text-[#575653] mt-1">
            Over past 7 days
          </p>
        </div>

        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E8B82] block">
            Revisions Today
          </span>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#657858] tracking-tight mt-1.5 flex items-baseline gap-1.5">
            <span>{revisions.length}</span>
            <span className="text-base font-normal text-[#8E8B82]">due</span>
          </p>
          <p className="text-xs text-[#575653] mt-1">
            Spaced repetition queue
          </p>
        </div>
      </div>

      {/* 3. ACTIVITY VISUALIZATION (HEATMAP) */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#18181B]">
              Activity & Consistency Heatmap
            </h2>
            <p className="text-xs text-[#575653] mt-0.5">
              Visual log of algorithmic problem solves and spaced repetition reviews over the past 18 weeks.
            </p>
          </div>
          <Link
            to="/analytics"
            className="text-xs font-semibold text-[#657858] hover:text-[#4E5D44] transition-colors"
          >
            Detailed Analytics →
          </Link>
        </div>

        <div className="pt-2">
          <ActivityHeatmap
            problems={recentProblems}
            revisions={revisions}
            weeklyActivity={weeklyActivity}
            weeksToShow={18}
          />
        </div>
      </div>

      {/* 4. WORKSPACE SPLIT: TODAY'S REVISIONS & DIFFICULTY PROGRESS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Spaced Repetition Queue (2 Columns) */}
        <div className="lg:col-span-2 rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-[#18181B] flex items-center gap-2">
                <Repeat className="h-4 w-4 text-[#657858]" />
                <span>Today's Revision Queue</span>
              </h2>
              <p className="text-xs text-[#575653] mt-0.5">
                Revise key problem patterns to anchor solutions into long-term recall.
              </p>
            </div>

            <Link
              to="/revision"
              className="text-xs font-semibold text-[#657858] hover:text-[#4E5D44] flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {revisions.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All caught up for today"
              description="You have no pending revisions due today. Solve new DSA problems to schedule future retention intervals."
              actionLabel="+ Add New Problem"
              onAction={handleOpenAddProblem}
            />
          ) : (
            <div className="space-y-2">
              {revisions.slice(0, 5).map((rev) => {
                const prob = rev.problem || {};
                return (
                  <div
                    key={rev._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-3 text-xs transition-all hover:border-[#D5D1C6] hover:bg-white"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {prob.difficulty && <DifficultyBadge difficulty={prob.difficulty} />}
                        <span className="rounded bg-[#F2F0E8] px-2 py-0.5 text-[10px] font-medium text-[#575653] border border-[#E6E3DB]">
                          {prob.topic || "DSA"}
                        </span>
                        <span className="text-[11px] font-semibold text-[#657858]">
                          Revision #{rev.revisionNumber} (+{rev.intervalDays}d)
                        </span>
                      </div>

                      <Link
                        to={`/problems/${prob._id}`}
                        className="font-semibold text-[#18181B] hover:text-[#657858] truncate block"
                      >
                        {prob.title || "DSA Problem"}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <Link
                        to={`/problems/${prob._id}`}
                        className="rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1 text-xs font-medium text-[#575653] hover:text-[#18181B] hover:border-[#D5D1C6] transition-colors"
                      >
                        Notes
                      </Link>

                      <Button
                        variant="accent"
                        size="xs"
                        onClick={() => handleCompleteRevision(rev._id)}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Mark Done</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Difficulty Breakdown (1 Column) */}
        <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
            <h3 className="text-sm font-bold tracking-tight text-[#18181B]">
              Difficulty Breakdown
            </h3>
            <Link
              to="/analytics"
              className="text-xs font-semibold text-[#657858] hover:text-[#4E5D44]"
            >
              Stats →
            </Link>
          </div>

          <div className="space-y-4">
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
                      {stat.solved} / {stat.total} solved
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#EAE7DF] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Helper Teaser Card */}
          <div className="rounded-lg border border-[#C6D2BF] bg-[#EEF2EB] p-3.5 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#4E5D44] font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Algorithm Assistant</span>
            </div>
            <p className="text-[11px] text-[#4E5D44] leading-relaxed">
              Unsure about time or space complexity? Paste code into AI Tools to get instant step-by-step breakdown.
            </p>
            <Link
              to="/ai-tools"
              className="inline-block text-[11px] font-semibold text-[#4E5D44] hover:underline pt-0.5"
            >
              Launch Studio →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. RECENT PROBLEMS TABLE */}
      <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[#18181B] flex items-center gap-2">
              <Code2 className="h-4 w-4 text-[#657858]" />
              <span>Recent DSA Problems</span>
            </h2>
            <p className="text-xs text-[#575653] mt-0.5">
              Latest problems logged into your preparation workspace.
            </p>
          </div>

          <Link
            to="/problems"
            className="text-xs font-semibold text-[#657858] hover:text-[#4E5D44] flex items-center gap-1"
          >
            <span>All Problems</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {recentProblems.length === 0 ? (
          <EmptyState
            icon={Code2}
            title="No problems logged yet"
            description="Start building your DSA history by logging the first problem you have solved."
            actionLabel="+ Add First Problem"
            onAction={handleOpenAddProblem}
          />
        ) : (
          <div className="divide-y divide-[#F2F0E8]">
            {recentProblems.map((prob) => (
              <div
                key={prob._id}
                className="flex items-center justify-between py-2.5 text-xs hover:bg-[#FAF9F5] px-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <DifficultyBadge difficulty={prob.difficulty} />
                  <PlatformBadge platform={prob.platform} />
                  <Link
                    to={`/problems/${prob._id}`}
                    className="font-medium text-[#18181B] hover:text-[#657858] truncate transition-colors"
                  >
                    {prob.title}
                  </Link>
                </div>

                <div className="flex items-center gap-4 text-[#8E8B82] shrink-0 text-[11px]">
                  <span className="hidden sm:inline font-medium text-[#575653]">
                    {prob.topic}
                  </span>
                  <span>
                    {new Date(prob.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;