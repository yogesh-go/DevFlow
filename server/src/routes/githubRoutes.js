const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/githubController");

const router = express.Router();

router.use(protect); // GitHub analytics protected

router.get("/:username", getProfile);

module.exports = router;
