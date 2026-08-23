const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getCurrentUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getCurrentUser);

module.exports = router;