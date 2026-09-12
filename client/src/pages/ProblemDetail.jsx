import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Repeat,
  Calendar,
  CheckCircle2,
  Sparkles,
  Save,
  Trash2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { DifficultyBadge, StatusBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import { getProblemById, updateProblem, deleteProblem } from "../services/problemService";
import { getRevisions, scheduleRevision, completeRevision } from "../services/revisionService";
import { explainCode, optimizeCode, generateNotes } from "../services/aiService";

function ProblemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState("");
  const [timeTaken, setTimeTaken] = useState(0);

  // AI Assistant Drawer/Modal state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState(null);

  useEffect(() => {
    const fetchProblemAndRevisions = async () => {
      try {
        setLoading(true);
        setError("");
        const [probData, revData] = await Promise.all([
          getProblemById(id),
          getRevisions({ problemId: id }),
        ]);

        setProblem(probData.problem);
        setNotes(probData.problem.notes || "");
        setTimeTaken(probData.problem.timeTaken || 0);

        // Combine all revisions
        const allRevs = [
          ...(revData.today || []),
          ...(revData.overdue || []),
          ...(revData.upcoming || []),
          ...(revData.completed || []),
        ];
        setRevisions(allRevs);
      } catch (err) {
        setError(err.message || "Failed to load problem details");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemAndRevisions();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateProblem(id, { status: newStatus });
      setProblem(res.problem);
      toast.success(`Status updated to ${newStatus}`);

      // Refresh revision list
      const revData = await getRevisions({ problemId: id });
      const allRevs = [
        ...(revData.today || []),
        ...(revData.overdue || []),
        ...(revData.upcoming || []),
        ...(revData.completed || []),
      ];
      setRevisions(allRevs);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleSaveNotesAndTime = async () => {
    try {
      setSavingNotes(true);
      const res = await updateProblem(id, { notes, timeTaken });
      setProblem(res.problem);
      toast.success("Notes and time saved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleScheduleManualRevision = async () => {
    try {
      await scheduleRevision(id);
      toast.success("Spaced repetition schedule generated!");
      const revData = await getRevisions({ problemId: id });
      setRevisions([
        ...(revData.today || []),
        ...(revData.overdue || []),
        ...(revData.upcoming || []),
        ...(revData.completed || []),
      ]);
    } catch (err) {
      toast.error(err.message || "Failed to schedule revisions");
    }
  };

  const handleCompleteRev = async (revisionId) => {
    try {
      await completeRevision(revisionId, { confidence: "high" });
      toast.success("Revision completed!");
      const [probData, revData] = await Promise.all([
        getProblemById(id),
        getRevisions({ problemId: id }),
      ]);
      setProblem(probData.problem);
      setRevisions([
        ...(revData.today || []),
        ...(revData.overdue || []),
        ...(revData.upcoming || []),
        ...(revData.completed || []),
      ]);
    } catch (err) {
      toast.error(err.message || "Failed to complete revision");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this problem permanently?")) return;
    try {
      await deleteProblem(id);
      toast.success("Problem removed");
      navigate("/problems");
    } catch (err) {
      toast.error(err.message || "Failed to delete problem");
    }
  };

  // AI Actions
  const handleAiExplain = async () => {
    try {
      setAiLoading(true);
      const codeSnippet = notes || `// ${problem.title} solution\nfunction solve() {\n  // Implementation\n}`;
      const res = await explainCode("javascript", codeSnippet);
      setAiOutput({ title: "AI Code Explanation", data: res.data });
    } catch (err) {
      toast.error(err.message || "AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiGenerateNotes = async () => {
    try {
      setAiLoading(true);
      const res = await generateNotes({
        title: problem.title,
        topic: problem.topic,
        difficulty: problem.difficulty,
        code: notes,
      });
      setAiOutput({ title: "AI Generated Structured Notes", data: res.data });
    } catch (err) {
      toast.error(err.message || "AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner message="Loading problem details..." />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
        <h3 className="mt-2 font-semibold text-white">Problem not found</h3>
        <p className="mt-1 text-sm text-slate-400">{error}</p>
        <Link
          to="/problems"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Problems</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Action Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/problems"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Problems</span>
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </button>
      </div>

      {/* Main Problem Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-blue-950/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <PlatformBadge platform={problem.platform} />
              <DifficultyBadge difficulty={problem.difficulty} />
              <span className="rounded bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {problem.topic}
              </span>
              <StatusBadge status={problem.status} />
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">
                {problem.title}
              </h1>
              {problem.problemUrl && (
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:underline shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Platform</span>
                </a>
              )}
            </div>
          </div>

          {/* Status Quick Controller */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Status:
            </label>
            <select
              value={problem.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="Not Started">Not Started</option>
              <option value="Attempted">Attempted</option>
              <option value="Solved">Solved</option>
              <option value="Need Revision">Need Revision</option>
            </select>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block">Time Spent</span>
            <span className="font-semibold text-white mt-0.5 block">
              {problem.timeTaken || 0} minutes
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Revision Count</span>
            <span className="font-semibold text-white mt-0.5 block">
              {problem.revisionCount || 0} completed
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Last Revised</span>
            <span className="font-semibold text-white mt-0.5 block">
              {problem.lastRevisedDate
                ? new Date(problem.lastRevisedDate).toLocaleDateString()
                : "Not revised yet"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block">Next Due Revision</span>
            <span className="font-semibold text-blue-400 mt-0.5 block">
              {problem.nextRevisionDate
                ? new Date(problem.nextRevisionDate).toLocaleDateString()
                : "None scheduled"}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Notes Editor (Left) & Spaced Repetition Timeline (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes & Code Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Solution Notes & Code Snippets
                </h3>
                <p className="text-xs text-slate-400">
                  Markdown supported. Document your algorithmic approach and time complexity.
                </p>
              </div>

              {/* AI Quick Actions Bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAiExplain}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>AI Explain</span>
                </button>

                <button
                  type="button"
                  onClick={handleAiGenerateNotes}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                  <span>AI Notes</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your approach intuition, time/space complexity, or paste clean solution code here..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Log Time Taken (mins):</span>
                <input
                  type="number"
                  min="0"
                  value={timeTaken}
                  onChange={(e) => setTimeTaken(parseInt(e.target.value, 10) || 0)}
                  className="w-20 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-white"
                />
              </div>

              <Button
                onClick={handleSaveNotesAndTime}
                loading={savingNotes}
                size="sm"
                className="inline-flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>Save Notes & Time</span>
              </Button>
            </div>
          </div>

          {/* AI Result Box */}
          {aiOutput && (
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                  <Sparkles className="h-4 w-4" />
                  <span>{aiOutput.title}</span>
                </div>
                <button
                  onClick={() => setAiOutput(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                {typeof aiOutput.data === "string"
                  ? aiOutput.data
                  : JSON.stringify(aiOutput.data, null, 2)}
              </div>
            </div>
          )}
        </div>

        {/* Spaced Repetition Panel (Right) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Spaced Repetition
                </h3>
                <p className="text-xs text-slate-400">
                  Schedule: Day 1, 3, 7, 15, 30
                </p>
              </div>

              {revisions.length === 0 && (
                <button
                  type="button"
                  onClick={handleScheduleManualRevision}
                  className="rounded-lg bg-blue-600/20 border border-blue-500/30 px-2.5 py-1 text-xs font-semibold text-blue-400 hover:bg-blue-600/30 transition-colors"
                >
                  Schedule
                </button>
              )}
            </div>

            {revisions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                <Repeat className="mx-auto h-6 w-6 text-slate-400 mb-2" />
                <p>No spaced repetition schedule yet.</p>
                <p className="mt-1">
                  Mark the problem as <span className="text-emerald-400 font-semibold">Solved</span> to automatically generate your 5-stage revision plan.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {revisions.map((rev) => {
                  const isCompleted = rev.status === "completed";
                  const isOverdue = rev.status === "overdue";
                  const dateStr = new Date(rev.scheduledDate).toLocaleDateString();

                  return (
                    <div
                      key={rev._id}
                      className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-colors ${
                        isCompleted
                          ? "border-emerald-500/20 bg-emerald-500/5 text-slate-300"
                          : isOverdue
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                          : "border-slate-800 bg-slate-950/60 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : isOverdue
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          #{rev.revisionNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            Day +{rev.intervalDays}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {dateStr}
                          </p>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCompleteRev(rev._id)}
                            className="rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-500 transition-colors"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
