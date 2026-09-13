import { Link } from "react-router-dom";
import { ExternalLink, CheckCircle2, Clock, Repeat, Edit3, Trash2 } from "lucide-react";
import { DifficultyBadge, StatusBadge, PlatformBadge } from "./ProblemBadge";

function ProblemItem({ problem, onUpdateStatus, onEdit, onDelete }) {
  const isSolved = problem.status === "Solved";

  const formattedRevisionText = problem.nextRevisionDate
    ? `Revision due ${new Date(problem.nextRevisionDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`
    : `Rev #${problem.revisionCount || 0}`;

  return (
    <div className="group rounded-xl border border-[#E6E3DB] bg-white p-4 transition-all hover:border-[#D5D1C6] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Title & Hierarchy Metadata */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <Link
              to={`/problems/${problem._id}`}
              className="text-sm sm:text-base font-bold text-[#18181B] hover:text-[#657858] transition-colors truncate"
            >
              {problem.title}
            </Link>

            {problem.problemUrl && (
              <a
                href={problem.problemUrl}
                target="_blank"
                rel="noreferrer"
                title="Open platform problem"
                className="text-[#8E8B82] hover:text-[#18181B] shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <DifficultyBadge difficulty={problem.difficulty} />
            <span className="text-[#8E8B82] font-medium">·</span>
            <span className="text-xs text-[#575653] font-medium">
              {problem.topic}
            </span>
            <span className="text-[#8E8B82] font-medium">·</span>
            <span className="text-xs text-[#8E8B82]">{problem.platform}</span>
            <span className="text-[#8E8B82] font-medium">·</span>
            <StatusBadge status={problem.status} />
          </div>

          {problem.notes && (
            <p className="text-xs text-[#8E8B82] line-clamp-1 font-mono pt-0.5">
              {problem.notes}
            </p>
          )}
        </div>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#575653] shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F2F0E8]">
          {problem.timeTaken > 0 && (
            <div className="flex items-center gap-1 text-[#8E8B82]" title="Time spent">
              <Clock className="h-3.5 w-3.5" />
              <span>{problem.timeTaken}m</span>
            </div>
          )}

          <div
            className="flex items-center gap-1 text-[#657858] font-medium"
            title="Spaced Repetition Schedule"
          >
            <Repeat className="h-3.5 w-3.5" />
            <span>{formattedRevisionText}</span>
          </div>

          {/* Quick Status Select */}
          <select
            value={problem.status}
            onChange={(e) => onUpdateStatus(problem._id, e.target.value)}
            className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-2.5 py-1 text-xs text-[#18181B] focus:border-[#657858] focus:bg-white focus:outline-none transition-colors"
          >
            <option value="Not Started">Not Started</option>
            <option value="Attempted">Attempted</option>
            <option value="Solved">Solved</option>
            <option value="Need Revision">Need Revision</option>
          </select>

          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            {!isSolved && (
              <button
                type="button"
                onClick={() => onUpdateStatus(problem._id, "Solved")}
                title="Mark Solved"
                className="rounded-md p-1.5 text-[#575653] hover:bg-[#EEF2EB] hover:text-[#4E5D44] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onEdit(problem)}
              title="Edit Problem"
              className="rounded-md p-1.5 text-[#575653] hover:bg-[#F2F0E8] hover:text-[#18181B] transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onDelete(problem._id)}
              title="Delete Problem"
              className="rounded-md p-1.5 text-[#8E8B82] hover:bg-[#FBF0F0] hover:text-[#933D3D] transition-colors"
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
