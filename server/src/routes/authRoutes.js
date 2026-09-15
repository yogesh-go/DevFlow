const express = require("express");
const {
  signup,
  verifyEmail,
  resendVerification,
  login,
  googleAuth,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/login", login);
router.post("/google", googleAuth);

module.exports = router;