import { useState } from "react";
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  Users,
  MapPin,
  Building,
} from "lucide-react";
import GitHubIcon from "../components/ui/GitHubIcon";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Button from "../components/ui/Button";
import { getGitHubProfile } from "../services/githubService";

function GitHubAnalytics() {
  const [username, setUsername] = useState("octocat");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a GitHub username");
      return;
    }

    try {
      setLoading(true);
      const res = await getGitHubProfile(username);
      setData(res.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch GitHub profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          GitHub Developer Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect public repositories, star metrics, and language breakdowns directly from the GitHub API.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
        <div className="relative flex-1">
          <GitHubIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub handle (e.g. torvalds, gaearon)"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <Button type="submit" loading={loading} size="sm">
          Search
        </Button>
      </form>

      {loading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner message="Fetching GitHub repository data..." />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  className="h-16 w-16 rounded-full border-2 border-blue-500/40 object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {data.profile.name}
                  </h2>
                  <p className="text-xs text-blue-400">@{data.profile.username}</p>
                  {data.profile.bio && (
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      {data.profile.bio}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={data.profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors self-start sm:self-center"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Profile Info Row */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span>{data.profile.publicRepos} Repositories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span>{data.profile.followers} Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <span>{data.metrics.totalStars} Total Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-emerald-400" />
                <span>{data.metrics.totalForks} Total Forks</span>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          {data.metrics.topLanguages?.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-3">
              <h3 className="text-base font-semibold text-white">Top Languages</h3>
              <div className="flex flex-wrap gap-2">
                {data.metrics.topLanguages.map((lang) => (
                  <span
                    key={lang.name}
                    className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 font-medium"
                  >
                    <span className="font-semibold text-white">{lang.name}</span>: {lang.count} repos
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repositories Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-white">Top Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-4 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-white hover:text-blue-400 text-sm truncate inline-flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                      {repo.language}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {repo.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3 w-3 text-slate-400" />
                      {repo.forks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GitHubAnalytics;
