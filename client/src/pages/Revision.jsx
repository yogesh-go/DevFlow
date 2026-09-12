import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { DifficultyBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { getRevisions, completeRevision } from "../services/revisionService";

function Revision() {
  const [data, setData] = useState({
    today: [],
    overdue: [],
    upcoming: [],
    completed: [],
    summary: { dueTodayCount: 0, overdueCount: 0, upcomingCount: 0, completedCount: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today"); // 'today' | 'overdue' | 'upcoming' | 'completed'

  const fetchRevisions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRevisions();
      setData(res);
    } catch (err) {
      toast.error(err.message || "Failed to load revisions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevisions();
  }, [fetchRevisions]);

  const handleComplete = async (revisionId, confidence = "medium") => {
    try {
      await completeRevision(revisionId, { confidence });
      toast.success("Revision completed!");
      fetchRevisions();
    } catch (err) {
      toast.error(err.message || "Failed to complete revision");
    }
  };

  const currentList =
    activeTab === "today"
      ? data.today
      : activeTab === "overdue"
      ? data.overdue
      : activeTab === "upcoming"
      ? data.upcoming
      : data.completed;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Spaced Repetition Revisions
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain high recall of DSA patterns using scientifically scheduled intervals (Day 1, 3, 7, 15, 30).
          </p>
        </div>

        <button
          onClick={fetchRevisions}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("today")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === "today"
              ? "border-blue-500/50 bg-blue-600/10 shadow-lg shadow-blue-950/20"
              : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Due Today</span>
            <Clock className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {data.summary?.dueTodayCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Scheduled for today</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overdue")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === "overdue"
              ? "border-rose-500/50 bg-rose-600/10 shadow-lg shadow-rose-950/20"
              : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Overdue</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 mt-2">
            {data.summary?.overdueCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Past due date</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === "upcoming"
              ? "border-indigo-500/50 bg-indigo-600/10 shadow-lg shadow-indigo-950/20"
              : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Upcoming</span>
            <Calendar className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            {data.summary?.upcomingCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Next in queue</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-2xl border p-4 text-left transition-all ${
            activeTab === "completed"
              ? "border-emerald-500/50 bg-emerald-600/10 shadow-lg shadow-emerald-950/20"
              : "border-slate-800 bg-slate-900/80 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {data.summary?.completedCount || 0}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Reviewed successfully</p>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 text-sm font-medium">
        <button
          onClick={() => setActiveTab("today")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "today"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Today's Revisions ({data.today?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "overdue"
              ? "border-rose-500 text-rose-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Overdue ({data.overdue?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "upcoming"
              ? "border-indigo-500 text-indigo-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Upcoming ({data.upcoming?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-3 px-4 border-b-2 transition-colors ${
            activeTab === "completed"
              ? "border-emerald-500 text-emerald-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          History ({data.completed?.length || 0})
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Calculating spaced repetition schedule..." />
        </div>
      ) : currentList.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
          <Repeat className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-4 text-base font-semibold text-white">
            No revisions in this section
          </h3>
          <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
            {activeTab === "today"
              ? "Great job! You have no revisions due today."
              : activeTab === "overdue"
              ? "No overdue revisions. You're completely up to date!"
              : "Solve problems in the DSA Tracker to schedule your spaced repetition revisions."}
          </p>
          <Link
            to="/problems"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            <span>Explore Problems</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {currentList.map((rev) => {
            const prob = rev.problem || {};
            const scheduledDateStr = new Date(rev.scheduledDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={rev._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-slate-700"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {prob.platform && <PlatformBadge platform={prob.platform} />}
                    {prob.difficulty && <DifficultyBadge difficulty={prob.difficulty} />}
                    {prob.topic && (
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {prob.topic}
                      </span>
                    )}
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400 border border-blue-500/20">
                      Revision #{rev.revisionNumber} (+{rev.intervalDays}d)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/problems/${prob._id}`}
                      className="text-base font-semibold text-white hover:text-blue-400 transition-colors truncate"
                    >
                      {prob.title || "DSA Problem"}
                    </Link>

                    {prob.problemUrl && (
                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-400 shrink-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Scheduled for: {scheduledDateStr}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {rev.status === "completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleComplete(rev._id, "medium")}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Complete Revision</span>
                      </button>

                      <Link
                        to={`/problems/${prob._id}`}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Details
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Revision;
