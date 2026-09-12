const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getRevisions,
  scheduleRevision,
  completeRevision,
} = require("../controllers/revisionController");

const router = express.Router();

router.use(protect); // All revision endpoints require authentication

router.get("/", getRevisions);
router.post("/", scheduleRevision);
router.put("/:id", completeRevision);

module.exports = router;
