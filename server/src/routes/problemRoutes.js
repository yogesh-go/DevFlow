const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");

const router = express.Router();

router.use(protect); // All problem endpoints require authentication

router.post("/", createProblem);
router.get("/", getProblems);
router.get("/:id", getProblemById);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);

module.exports = router;
