const analyticsService = require("../services/analyticsService");

const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getUserAnalytics(req.user.userId);

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};
