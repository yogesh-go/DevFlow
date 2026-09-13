const express = require("express");

const protect = require("../middleware/authMiddleware");
const {
  getCurrentUser,
  updateUserProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;