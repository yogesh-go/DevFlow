import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  CheckCircle2,
  Repeat,
  Sparkles,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Code2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getAnalytics } from "../services/analyticsService";
import { getRevisions, completeRevision } from "../services/revisionService";
import { getProblems } from "../services/problemService";
import { DifficultyBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";

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
        getProblems({ limit: 5, sortBy: "createdAt", sortOrder: "desc" }),
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

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Developer Workspace
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-600" />
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            Welcome back, {user?.name || "Developer"} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track your DSA consistency, spaced repetition revision schedule, and AI coding insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Problem</span>
          </Link>

          <Link
            to="/ai-tools"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Workspace</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Problems Solved */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Problems Solved</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-3">
            {overview.solvedProblems}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {overview.totalProblems} total logged
          </p>
        </div>

        {/* Current Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Daily Streak</span>
            <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-extrabold text-amber-400 mt-3">
            {overview.currentStreak}{" "}
            <span className="text-sm font-normal text-slate-400">days</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Consistency streak active
          </p>
        </div>

        {/* Due Today's Revisions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Due Revisions</span>
            <Repeat className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-blue-400 mt-3">
            {revisions.length}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Scheduled for review today
          </p>
        </div>

        {/* Success Rate */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg shadow-blue-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Success Rate</span>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-3xl font-extrabold text-purple-400 mt-3">
            {overview.successRate}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Across attempted problems
          </p>
        </div>
      </div>

      {/* Grid: Revisions Widget & Difficulty Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Spaced Repetition Due (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Repeat className="h-4 w-4 text-blue-400" />
                <span>Today's Spaced Repetition Queue</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revise key problem patterns to ensure long-term retention before interviews.
              </p>
            </div>

            <Link
              to="/revision"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {revisions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400 mb-2" />
              <p className="font-semibold text-slate-200">All caught up for today!</p>
              <p className="mt-1">
                You have zero pending revisions due today. Solve new DSA problems to schedule future intervals.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {revisions.slice(0, 4).map((rev) => {
                const prob = rev.problem || {};
                return (
                  <div
                    key={rev._id}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs transition-colors hover:border-slate-700"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        {prob.difficulty && <DifficultyBadge difficulty={prob.difficulty} />}
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                          {prob.topic || "DSA"}
                        </span>
                        <span className="text-blue-400 font-semibold text-[11px]">
                          #Rev {rev.revisionNumber}
                        </span>
                      </div>
                      <Link
                        to={`/problems/${prob._id}`}
                        className="font-semibold text-white hover:text-blue-400 truncate block"
                      >
                        {prob.title || "Problem"}
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCompleteRevision(rev._id)}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shrink-0"
                    >
                      Done
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Difficulty Distribution (1 column) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Difficulty Breakdown</h3>
            <Link
              to="/analytics"
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Analytics →
            </Link>
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
                      {stat.solved} / {stat.total}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick AI Assist Card */}
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-950/40 to-indigo-950/30 p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>AI Code Assistant</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Stuck on algorithmic complexity or edge cases? Use DevFlow AI to explain, optimize, and generate revision notes.
            </p>
            <Link
              to="/ai-tools"
              className="inline-block text-blue-400 font-semibold hover:underline"
            >
              Launch AI Tools →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Problems Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="h-4 w-4 text-blue-400" />
              <span>Recent DSA Problems</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest problems added to your workspace.
            </p>
          </div>

          <Link
            to="/problems"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>All Problems</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentProblems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
            <p>No problems logged yet.</p>
            <Link
              to="/problems"
              className="mt-3 inline-flex items-center gap-1.5 text-blue-400 hover:underline"
            >
              <span>Add your first problem</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentProblems.map((prob) => (
              <div
                key={prob._id}
                className="flex items-center justify-between py-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <PlatformBadge platform={prob.platform} />
                  <DifficultyBadge difficulty={prob.difficulty} />
                  <Link
                    to={`/problems/${prob._id}`}
                    className="font-medium text-white hover:text-blue-400 truncate"
                  >
                    {prob.title}
                  </Link>
                </div>

                <div className="flex items-center gap-3 text-slate-400 shrink-0">
                  <span>{prob.topic}</span>
                  <span className="hidden sm:inline">
                    {new Date(prob.createdAt).toLocaleDateString()}
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