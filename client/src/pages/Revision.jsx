import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Repeat,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { DifficultyBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
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

  // React to new problems created across the workspace
  useEffect(() => {
    const handleProblemCreated = () => {
      fetchRevisions();
    };

    window.addEventListener("devflow:problem-created", handleProblemCreated);
    return () => {
      window.removeEventListener("devflow:problem-created", handleProblemCreated);
    };
  }, [fetchRevisions]);

  const handleComplete = async (revisionId, confidence = "high") => {
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            Productivity Queue
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Today's Revision
          </h1>
          <p className="text-xs sm:text-sm text-[#575653]">
            Maintain permanent pattern recall via automated interval spacing (Day 1, 3, 7, 15, 30).
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchRevisions}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {/* Metric Summary Tabs Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setActiveTab("today")}
          className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === "today"
              ? "border-[#657858] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#657858]/30"
              : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Due Today
            </span>
            <Clock className="h-4 w-4 text-[#657858]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1.5">
            {data.summary?.dueTodayCount || 0}
          </p>
          <p className="text-[11px] text-[#575653] mt-0.5">
            {data.today?.length > 0 ? "Ready for review" : "Queue caught up"}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overdue")}
          className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === "overdue"
              ? "border-[#933D3D] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#933D3D]/30"
              : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Overdue
            </span>
            <AlertTriangle className="h-4 w-4 text-[#933D3D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#933D3D] mt-1.5">
            {data.summary?.overdueCount || 0}
          </p>
          <p className="text-[11px] text-[#8E8B82] mt-0.5">Missed target dates</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("upcoming")}
          className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === "upcoming"
              ? "border-[#18181B] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#18181B]/30"
              : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Upcoming
            </span>
            <Calendar className="h-4 w-4 text-[#575653]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1.5">
            {data.summary?.upcomingCount || 0}
          </p>
          <p className="text-[11px] text-[#8E8B82] mt-0.5">Next in queue</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("completed")}
          className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
            activeTab === "completed"
              ? "border-[#426447] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-[#426447]/30"
              : "border-[#E6E3DB] bg-white hover:border-[#D5D1C6]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Completed
            </span>
            <CheckCircle2 className="h-4 w-4 text-[#426447]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#426447] mt-1.5">
            {data.summary?.completedCount || 0}
          </p>
          <p className="text-[11px] text-[#8E8B82] mt-0.5">Retained items</p>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#E6E3DB] text-xs font-semibold">
        <button
          onClick={() => setActiveTab("today")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "today"
              ? "border-[#657858] text-[#18181B]"
              : "border-transparent text-[#575653] hover:text-[#18181B]"
          }`}
        >
          Today's Queue ({data.today?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("overdue")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "overdue"
              ? "border-[#933D3D] text-[#933D3D]"
              : "border-transparent text-[#575653] hover:text-[#18181B]"
          }`}
        >
          Overdue ({data.overdue?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "upcoming"
              ? "border-[#18181B] text-[#18181B]"
              : "border-transparent text-[#575653] hover:text-[#18181B]"
          }`}
        >
          Upcoming ({data.upcoming?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab("completed")}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === "completed"
              ? "border-[#426447] text-[#426447]"
              : "border-transparent text-[#575653] hover:text-[#18181B]"
          }`}
        >
          History ({data.completed?.length || 0})
        </button>
      </div>

      {/* Content Queue List */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner message="Calculating spaced repetition schedule..." />
        </div>
      ) : currentList.length === 0 ? (
        <EmptyState
          icon={Repeat}
          title="No revisions in this section"
          description={
            activeTab === "today"
              ? "All caught up for today! You have zero pending revisions due."
              : activeTab === "overdue"
              ? "No overdue revisions. Your preparation schedule is right on track."
              : "Solve problems in the DSA Tracker to schedule your automatic spaced repetition intervals."
          }
          actionButton={
            <Link to="/problems">
              <Button variant="secondary" size="sm">
                <span>Go to Problems</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          }
        />
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
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-xl border border-[#E6E3DB] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:border-[#D5D1C6]"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {prob.difficulty && <DifficultyBadge difficulty={prob.difficulty} />}
                    {prob.platform && <PlatformBadge platform={prob.platform} />}
                    {prob.topic && (
                      <span className="rounded bg-[#F2F0E8] px-2 py-0.5 text-[10px] font-medium text-[#575653] border border-[#E6E3DB]">
                        {prob.topic}
                      </span>
                    )}
                    <span className="rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
                      Revision #{rev.revisionNumber} (+{rev.intervalDays}d)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/problems/${prob._id}`}
                      className="text-sm font-bold text-[#18181B] hover:text-[#657858] transition-colors truncate"
                    >
                      {prob.title || "DSA Problem"}
                    </Link>

                    {prob.problemUrl && (
                      <a
                        href={prob.problemUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8E8B82] hover:text-[#18181B] shrink-0"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-[11px] text-[#8E8B82] flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    <span>Scheduled for: {scheduledDateStr}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {rev.status === "completed" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#426447]">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Link to={`/problems/${prob._id}`}>
                        <Button variant="secondary" size="xs">
                          Start Revision
                        </Button>
                      </Link>

                      <Button
                        variant="accent"
                        size="xs"
                        onClick={() => handleComplete(rev._id, "high")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Mark Done</span>
                      </Button>
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
