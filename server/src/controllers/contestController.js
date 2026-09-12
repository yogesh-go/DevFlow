const contestService = require("../services/contestService");

const getContests = async (req, res, next) => {
  try {
    const contests = await contestService.getUpcomingContests();

    res.status(200).json({
      success: true,
      contests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContests,
};
