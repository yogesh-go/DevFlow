import { useState, useMemo } from "react";

function ActivityHeatmap({
  problems = [],
  revisions = [],
  weeklyActivity = [],
  weeksToShow = 18,
}) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Build a date-indexed activity map from real data
  const activityMap = useMemo(() => {
    const map = {};

    // 1. Process problems
    if (Array.isArray(problems)) {
      problems.forEach((p) => {
        const dStr = p.solvedDate
          ? new Date(p.solvedDate).toISOString().split("T")[0]
          : p.createdAt
          ? new Date(p.createdAt).toISOString().split("T")[0]
          : null;
        if (dStr) {
          if (!map[dStr]) map[dStr] = { problems: 0, revisions: 0 };
          if (p.status === "Solved") {
            map[dStr].problems += 1;
          }
        }
      });
    }

    // 2. Process revisions
    if (Array.isArray(revisions)) {
      revisions.forEach((r) => {
        const dStr = r.completedAt
          ? new Date(r.completedAt).toISOString().split("T")[0]
          : r.updatedAt && r.status === "completed"
          ? new Date(r.updatedAt).toISOString().split("T")[0]
          : null;
        if (dStr) {
          if (!map[dStr]) map[dStr] = { problems: 0, revisions: 0 };
          map[dStr].revisions += 1;
        }
      });
    }

    // 3. Process weeklyActivity from backend analytics if provided
    if (Array.isArray(weeklyActivity)) {
      weeklyActivity.forEach((w) => {
        if (w.date && w.solvedCount) {
          if (!map[w.date]) map[w.date] = { problems: 0, revisions: 0 };
          map[w.date].problems = Math.max(map[w.date].problems, w.solvedCount);
        }
      });
    }

    return map;
  }, [problems, revisions, weeklyActivity]);

  // Generate calendar grid for past N weeks ending on today
  const calendarGrid = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = weeksToShow * 7;
    const days = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const data = activityMap[dateStr] || { problems: 0, revisions: 0 };
      const totalCount = data.problems + data.revisions;

      days.push({
        date,
        dateStr,
        dayOfWeek: date.getDay(), // 0 = Sun, 1 = Mon ...
        problems: data.problems,
        revisions: data.revisions,
        total: totalCount,
      });
    }

    // Group into columns of 7 days (weeks)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [activityMap, weeksToShow]);

  // Sage green intensity shades
  const getColorClass = (total) => {
    if (total === 0) return "bg-[#EBE8DF] hover:ring-1 hover:ring-[#C8C3B4]";
    if (total === 1) return "bg-[#CBD7C3] hover:ring-1 hover:ring-[#657858]";
    if (total === 2) return "bg-[#A1B895] hover:ring-1 hover:ring-[#4E5D44]";
    if (total === 3) return "bg-[#657858] hover:ring-1 hover:ring-[#384331]";
    return "bg-[#3D4B34] hover:ring-1 hover:ring-[#1E2619]";
  };

  const handleMouseEnter = (day, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setHoveredDay(day);
  };

  return (
    <div className="relative w-full overflow-x-auto pb-2">
      <div className="min-w-[620px]">
        {/* Days of week labels + Grid */}
        <div className="flex gap-2 items-start">
          <div className="flex flex-col justify-between text-[10px] text-[#8E8B82] pt-3 pr-1 font-medium select-none h-[102px]">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="flex gap-1.5 flex-1">
            {calendarGrid.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    onMouseEnter={(e) => handleMouseEnter(day, e)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-3 w-3 rounded-xs transition-colors cursor-pointer ${getColorClass(
                      day.total
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#8E8B82]">
          <span className="text-[11px]">
            Activity reflects problem solves and spaced repetition completions
          </span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-xs bg-[#EBE8DF]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#CBD7C3]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#A1B895]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#657858]" />
            <span className="h-2.5 w-2.5 rounded-xs bg-[#3D4B34]" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full rounded-lg border border-[#E6E3DB] bg-[#18181B] px-3 py-2 text-xs text-white shadow-xl"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <p className="font-semibold text-white">
            {hoveredDay.date.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="mt-1 space-y-0.5 text-[11px] text-[#A1A1AA]">
            <p>
              Problems Solved:{" "}
              <span className="font-medium text-[#CBD7C3]">
                {hoveredDay.problems}
              </span>
            </p>
            <p>
              Revisions Completed:{" "}
              <span className="font-medium text-[#CBD7C3]">
                {hoveredDay.revisions}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityHeatmap;
