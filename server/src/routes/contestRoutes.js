const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getContests } = require("../controllers/contestController");

const router = express.Router();

router.use(protect); // Contests route protected

router.get("/", getContests);

module.exports = router;
