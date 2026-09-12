import { useState, useEffect } from "react";
import { Trophy, ExternalLink, Calendar, Clock, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Competitive Programming Contests
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live schedule for upcoming algorithmic contests on LeetCode, Codeforces, CodeChef, and GeeksforGeeks.
          </p>
        </div>

        <button
          onClick={fetchContests}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Schedule</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner message="Fetching live contest calendar..." />
        </div>
      ) : contests.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400 text-sm">
          <Trophy className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p>No upcoming contests found at this time.</p>
        </div>
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
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 hover:border-slate-700 transition-all shadow-md shadow-blue-950/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <PlatformBadge platform={contest.platform} />
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                      {contest.status || "Upcoming"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {contest.name}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{startStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Duration: {contest.duration}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={contest.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors w-full"
                >
                  <span>Register / Open Contest</span>
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
