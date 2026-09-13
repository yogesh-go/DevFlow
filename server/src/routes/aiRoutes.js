const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getAIStatus,
  analyzeResume,
  generateInterviewQuestions,
  getProfileContext,
} = require("../controllers/aiController");

const router = express.Router();

router.use(protect); // All AI endpoints are secured and require valid JWT authentication

router.get("/status", getAIStatus);
router.get("/profile-context", getProfileContext);
router.post("/resume", analyzeResume);
router.post("/interview", generateInterviewQuestions);

module.exports = router;
