import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle2, Clock, Repeat, Edit3, Trash2 } from "lucide-react";
import { DifficultyBadge, StatusBadge, PlatformBadge } from "./ProblemBadge";

function ProblemItem({ problem, onUpdateStatus, onEdit, onDelete }) {
  const isSolved = problem.status === "Solved";

  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/90 p-4 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-blue-950/10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <PlatformBadge platform={problem.platform} />
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
              {problem.topic}
            </span>
            <StatusBadge status={problem.status} />
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/problems/${problem._id}`}
              className="text-base font-semibold text-white hover:text-blue-400 transition-colors truncate"
            >
              {problem.title}
            </Link>

            {problem.problemUrl && (
              <a
                href={problem.problemUrl}
                target="_blank"
                rel="noreferrer"
                title="Open external problem link"
                className="text-slate-400 hover:text-blue-400 shrink-0"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>

          {problem.notes && (
            <p className="mt-1.5 text-xs text-slate-400 line-clamp-1">
              {problem.notes}
            </p>
          )}
        </div>

        {/* Stats & Quick Actions */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
          {problem.timeTaken > 0 && (
            <div className="flex items-center gap-1.5" title="Time taken">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{problem.timeTaken}m</span>
            </div>
          )}

          <div className="flex items-center gap-1.5" title="Spaced Repetition Count">
            <Repeat className="h-3.5 w-3.5 text-slate-400" />
            <span>Rev: {problem.revisionCount || 0}</span>
          </div>

          {/* Quick Status Select */}
          <select
            value={problem.status}
            onChange={(e) => onUpdateStatus(problem._id, e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          >
            <option value="Not Started">Not Started</option>
            <option value="Attempted">Attempted</option>
            <option value="Solved">Solved</option>
            <option value="Need Revision">Need Revision</option>
          </select>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1">
            {!isSolved && (
              <button
                type="button"
                onClick={() => onUpdateStatus(problem._id, "Solved")}
                title="Mark Solved"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(problem)}
              title="Edit Problem"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(problem._id)}
              title="Delete Problem"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemItem;
