const githubService = require("../services/githubService");

const getProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const data = await githubService.getGitHubProfile(username);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
