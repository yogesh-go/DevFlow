const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  explainCode,
  optimizeCode,
  generateNotes,
  analyzeResume,
  generateInterviewQuestions,
} = require("../controllers/aiController");

const router = express.Router();

router.use(protect); // All AI endpoints are secured and require valid JWT authentication

router.post("/explain", explainCode);
router.post("/optimize", optimizeCode);
router.post("/notes", generateNotes);
router.post("/resume", analyzeResume);
router.post("/interview", generateInterviewQuestions);

module.exports = router;
