/**
 * GitHub Analytics Service
 * Connects to public GitHub REST API to fetch developer statistics
 */

const getGitHubProfile = async (username) => {
  if (!username || !username.trim()) {
    const error = new Error("GitHub username is required");
    error.statusCode = 400;
    throw error;
  }

  const cleanUsername = encodeURIComponent(username.trim());
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "DevFlow-Workspace-App",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${cleanUsername}`, { headers }),
    fetch(`https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`, { headers }),
  ]);

  if (!userRes.ok) {
    if (userRes.status === 404) {
      const error = new Error(`GitHub user '${username}' not found.`);
      error.statusCode = 404;
      throw error;
    }
    const error = new Error("Failed to fetch GitHub profile from GitHub API.");
    error.statusCode = userRes.status;
    throw error;
  }

  const userData = await userRes.json();
  const reposData = reposRes.ok ? await reposRes.json() : [];

  // Calculate languages and stars
  const languageMap = {};
  let totalStars = 0;
  let totalForks = 0;

  if (Array.isArray(reposData)) {
    reposData.forEach((repo) => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    });
  }

  const topLanguages = Object.entries(languageMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topRepos = Array.isArray(reposData)
    ? reposData.slice(0, 6).map((r) => ({
        name: r.name,
        description: r.description || "No description provided",
        htmlUrl: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language || "Plain Text",
        updatedAt: r.updated_at,
      }))
    : [];

  return {
    profile: {
      username: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio,
      avatarUrl: userData.avatar_url,
      profileUrl: userData.html_url,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      location: userData.location,
      company: userData.company,
      createdAt: userData.created_at,
    },
    metrics: {
      totalStars,
      totalForks,
      topLanguages,
    },
    topRepos,
  };
};

module.exports = {
  getGitHubProfile,
};
