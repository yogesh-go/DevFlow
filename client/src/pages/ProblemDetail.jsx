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
  Eye,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import { DifficultyBadge, StatusBadge, PlatformBadge } from "../components/problems/ProblemBadge";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import { getProblemById, updateProblem, deleteProblem } from "../services/problemService";
import { getRevisions, scheduleRevision, completeRevision } from "../services/revisionService";
import { explainCode, generateNotes } from "../services/aiService";

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
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // AI Assistant output state
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
      toast.success("Notebook entry updated!");
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
    if (!window.confirm("Delete this problem permanently from your workspace?")) return;
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
      setAiOutput({ title: "Algorithmic Code Explanation", data: res.data });
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
      setAiOutput({ title: "Structured Solution Notes", data: res.data });
    } catch (err) {
      toast.error(err.message || "AI request failed");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner message="Loading developer notebook entry..." />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="rounded-xl border border-[#E8BFBF] bg-[#FBF0F0] p-8 text-center max-w-md mx-auto space-y-3">
        <AlertCircle className="mx-auto h-8 w-8 text-[#933D3D]" />
        <h3 className="font-bold text-[#18181B]">Problem not found</h3>
        <p className="text-xs text-[#575653]">{error || "Could not retrieve problem details."}</p>
        <Link to="/problems">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Problems</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-3">
        <Link
          to="/problems"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#575653] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problems</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8E8B82]">
              Status:
            </label>
            <select
              value={problem.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border border-[#E6E3DB] bg-white px-2.5 py-1 text-xs font-semibold text-[#18181B] focus:border-[#657858] focus:outline-none transition-colors"
            >
              <option value="Not Started">Not Started</option>
              <option value="Attempted">Attempted</option>
              <option value="Solved">Solved</option>
              <option value="Need Revision">Need Revision</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 rounded-md border border-[#E8BFBF] bg-[#FBF0F0] px-2.5 py-1 text-xs font-medium text-[#933D3D] hover:bg-[#F5E1E1] transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Split Notebook View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Problem Metadata & Spaced Repetition */}
        <div className="lg:col-span-5 space-y-5">
          {/* Metadata Card */}
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={problem.difficulty} />
                <PlatformBadge platform={problem.platform} />
                <span className="rounded bg-[#F2F0E8] px-2 py-0.5 text-[11px] font-medium text-[#575653] border border-[#E6E3DB]">
                  {problem.topic}
                </span>
                <StatusBadge status={problem.status} />
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#18181B] pt-1">
                {problem.title}
              </h1>

              {problem.problemUrl && (
                <a
                  href={problem.problemUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#657858] hover:underline pt-0.5"
                >
                  <span>Open on {problem.platform}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#E6E3DB] pt-3 text-xs">
              <div>
                <span className="text-[11px] text-[#8E8B82] block">Time Spent</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="number"
                    min="0"
                    value={timeTaken}
                    onChange={(e) => setTimeTaken(parseInt(e.target.value, 10) || 0)}
                    className="w-16 rounded border border-[#E6E3DB] bg-[#FAF9F5] px-2 py-0.5 text-xs text-[#18181B] font-semibold"
                  />
                  <span className="text-[#575653]">mins</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-[#8E8B82] block">Revision Count</span>
                <span className="font-semibold text-[#18181B] mt-1 block">
                  {problem.revisionCount || 0} completed
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#8E8B82] block">Last Revised</span>
                <span className="font-medium text-[#575653] mt-0.5 block">
                  {problem.lastRevisedDate
                    ? new Date(problem.lastRevisedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Not yet"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#8E8B82] block">Next Due</span>
                <span className="font-semibold text-[#657858] mt-0.5 block">
                  {problem.nextRevisionDate
                    ? new Date(problem.nextRevisionDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "None scheduled"}
                </span>
              </div>
            </div>
          </div>

          {/* Spaced Repetition Interval Timeline */}
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between border-b border-[#E6E3DB] pb-2.5">
              <div>
                <h3 className="text-sm font-bold text-[#18181B] flex items-center gap-1.5">
                  <Repeat className="h-4 w-4 text-[#657858]" />
                  <span>Retention Schedule</span>
                </h3>
                <p className="text-[11px] text-[#8E8B82]">
                  Interval stages: Day 1, 3, 7, 15, 30
                </p>
              </div>

              {revisions.length === 0 && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleScheduleManualRevision}
                >
                  Generate Plan
                </Button>
              )}
            </div>

            {revisions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#E6E3DB] p-5 text-center text-xs text-[#575653]">
                <p>No spaced repetition schedule yet.</p>
                <p className="text-[11px] text-[#8E8B82] mt-1">
                  Mark this problem as Solved to generate your 5-stage revision timeline.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {revisions.map((rev) => {
                  const isCompleted = rev.status === "completed";
                  const isOverdue = rev.status === "overdue";
                  const dateStr = new Date(rev.scheduledDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={rev._id}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs transition-colors ${
                        isCompleted
                          ? "border-[#BCD4C2] bg-[#EDF4EE] text-[#426447]"
                          : isOverdue
                          ? "border-[#E8BFBF] bg-[#FBF0F0] text-[#933D3D]"
                          : "border-[#E6E3DB] bg-[#FAF9F5] text-[#18181B]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                            isCompleted
                              ? "bg-[#BCD4C2] text-[#426447]"
                              : isOverdue
                              ? "bg-[#E8BFBF] text-[#933D3D]"
                              : "bg-[#E6E3DB] text-[#575653]"
                          }`}
                        >
                          #{rev.revisionNumber}
                        </div>
                        <div>
                          <p className="font-semibold text-xs">
                            Day +{rev.intervalDays}
                          </p>
                          <p className="text-[10px] text-[#8E8B82]">{dateStr}</p>
                        </div>
                      </div>

                      <div>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#426447]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <Button
                            variant="accent"
                            size="xs"
                            onClick={() => handleCompleteRev(rev._id)}
                          >
                            Mark Done
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 Cols): Notes / Solution Code Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            {/* Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E6E3DB] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#18181B]">
                  Solution Notes & Code Approach
                </h3>
                <p className="text-xs text-[#575653]">
                  Document key invariants, complexity, and mistakes for future revisions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="inline-flex items-center gap-1 text-xs text-[#575653] hover:text-[#18181B] font-medium"
                >
                  {isPreviewMode ? <Code className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{isPreviewMode ? "Editor" : "Preview"}</span>
                </button>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleAiExplain}
                  disabled={aiLoading}
                >
                  <Sparkles className="h-3 w-3 text-[#657858]" />
                  <span>AI Explain</span>
                </Button>

                <Button
                  variant="outline"
                  size="xs"
                  onClick={handleAiGenerateNotes}
                  disabled={aiLoading}
                >
                  <Sparkles className="h-3 w-3 text-[#657858]" />
                  <span>AI Notes</span>
                </Button>
              </div>
            </div>

            {/* Editor or Preview Pane */}
            {isPreviewMode ? (
              <div className="w-full min-h-[380px] rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 font-mono text-xs text-[#18181B] leading-relaxed whitespace-pre-wrap">
                {notes || "No notes documented yet. Switch to Editor mode to write your approach."}
              </div>
            ) : (
              <textarea
                rows={16}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write your approach intuition, time/space complexity, or paste your solution code here..."
                className="w-full rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] p-4 font-mono text-xs text-[#18181B] placeholder-[#8E8B82] focus:border-[#657858] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#657858]/15 transition-all leading-relaxed"
              />
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E6E3DB]">
              <span className="text-[11px] text-[#8E8B82]">
                Markdown and clean code syntax supported.
              </span>

              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveNotesAndTime}
                loading={savingNotes}
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Notes & Time</span>
              </Button>
            </div>
          </div>

          {/* AI Result Box */}
          {aiOutput && (
            <div className="rounded-xl border border-[#C6D2BF] bg-[#EEF2EB] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#C6D2BF] pb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#4E5D44]">
                  <Sparkles className="h-4 w-4 text-[#657858]" />
                  <span>{aiOutput.title}</span>
                </div>
                <button
                  onClick={() => setAiOutput(null)}
                  className="text-xs font-medium text-[#4E5D44] hover:text-[#18181B]"
                >
                  Close
                </button>
              </div>

              <div className="text-xs text-[#18181B] leading-relaxed font-mono whitespace-pre-wrap bg-white p-3.5 rounded-lg border border-[#C6D2BF]">
                {typeof aiOutput.data === "string"
                  ? aiOutput.data
                  : JSON.stringify(aiOutput.data, null, 2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
