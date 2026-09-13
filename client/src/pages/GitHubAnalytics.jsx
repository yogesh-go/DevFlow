import { useState } from "react";
import {
  Search,
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  Users,
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
      <div className="border-b border-[#E6E3DB] pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#657858]">
          Developer Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18181B]">
          GitHub Analytics
        </h1>
        <p className="text-xs sm:text-sm text-[#575653] mt-1">
          Inspect public repositories, star counts, and language distribution directly from GitHub.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2.5 max-w-md">
        <div className="relative flex-1">
          <GitHubIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-[#8E8B82]" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub handle (e.g. torvalds)"
            className="w-full rounded-lg border border-[#E6E3DB] bg-white py-2 pl-10 pr-4 text-xs text-[#18181B] placeholder-[#8E8B82] outline-none focus:border-[#657858] focus:ring-2 focus:ring-[#657858]/15"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" loading={loading}>
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
          <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile.avatarUrl}
                  alt={data.profile.name}
                  className="h-16 w-16 rounded-xl border border-[#E6E3DB] object-cover"
                />
                <div>
                  <h2 className="text-xl font-bold text-[#18181B]">
                    {data.profile.name}
                  </h2>
                  <p className="text-xs font-mono text-[#657858]">@{data.profile.username}</p>
                  {data.profile.bio && (
                    <p className="text-xs text-[#575653] mt-1 max-w-md leading-relaxed">
                      {data.profile.bio}
                    </p>
                  )}
                </div>
              </div>

              <a
                href={data.profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E6E3DB] bg-[#FAF9F5] px-4 py-2 text-xs font-semibold text-[#18181B] hover:bg-white hover:border-[#D5D1C6] transition-colors self-start sm:self-center"
              >
                <GitHubIcon className="h-4 w-4" />
                <span>View on GitHub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Quick Profile Info Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E6E3DB] pt-4 text-xs text-[#575653]">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#657858]" />
                <span>{data.profile.publicRepos} Repositories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#657858]" />
                <span>{data.profile.followers} Followers</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-[#865B20]" />
                <span>{data.metrics.totalStars} Total Stars</span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork className="h-4 w-4 text-[#575653]" />
                <span>{data.metrics.totalForks} Total Forks</span>
              </div>
            </div>
          </div>

          {/* Top Languages */}
          {data.metrics.topLanguages?.length > 0 && (
            <div className="rounded-xl border border-[#E6E3DB] bg-white p-6 space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <h3 className="text-sm font-bold text-[#18181B]">Top Languages</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {data.metrics.topLanguages.map((lang) => (
                  <span
                    key={lang.name}
                    className="rounded-md border border-[#E6E3DB] bg-[#FAF9F5] px-3 py-1 text-xs text-[#575653] font-medium"
                  >
                    <span className="font-semibold text-[#18181B]">{lang.name}</span>: {lang.count} repos
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Repositories Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#18181B]">Top Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.topRepos.map((repo) => (
                <div
                  key={repo.name}
                  className="rounded-xl border border-[#E6E3DB] bg-white p-4 space-y-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D5D1C6] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <a
                      href={repo.htmlUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#18181B] hover:text-[#657858] text-xs truncate inline-flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="h-3 w-3 text-[#8E8B82]" />
                    </a>
                    <span className="rounded bg-[#F2F0E8] px-2 py-0.5 text-[10px] text-[#575653] font-medium border border-[#E6E3DB]">
                      {repo.language || "Plain"}
                    </span>
                  </div>

                  <p className="text-xs text-[#575653] line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#8E8B82] pt-2 border-t border-[#F2F0E8]">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#865B20]" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="h-3.5 w-3.5 text-[#575653]" />
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
