import { useState, useEffect } from "react";
import { Trophy, ExternalLink, Calendar, Clock, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { getContests } from "../services/contestService";
import { PlatformBadge } from "../components/problems/ProblemBadge";

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await getContests();
      setContests(res.contests || []);
    } catch (err) {
      toast.error(err.message || "Failed to load contest schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DB] pb-5">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
            Competitive Programming
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
            Contest Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#575653]">
            Live schedule for upcoming algorithmic rounds on LeetCode, Codeforces, CodeChef, and GeeksforGeeks.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={fetchContests}
          className="self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Calendar</span>
        </Button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner message="Fetching live contest calendar..." />
        </div>
      ) : contests.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No upcoming contests scheduled"
          description="There are currently no upcoming active rounds reported by platform feeds."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map((contest, idx) => {
            const startStr = new Date(contest.startTime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-[#E6E3DB] bg-white p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D5D1C6] transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <PlatformBadge platform={contest.platform} />
                    <span className="rounded bg-[#EEF2EB] px-2 py-0.5 text-[10px] font-semibold text-[#4E5D44] border border-[#C6D2BF]">
                      {contest.status || "Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#18181B] line-clamp-2 leading-snug">
                    {contest.name}
                  </h3>

                  <div className="space-y-1 text-xs text-[#575653]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-[#8E8B82]" />
                      <span>{startStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#8E8B82]" />
                      <span>Duration: {contest.duration}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={contest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-3.5 py-2 text-xs font-semibold text-[#18181B] hover:bg-white hover:border-[#D5D1C6] transition-colors w-full"
                >
                  <span>Register on Platform</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Contests;
