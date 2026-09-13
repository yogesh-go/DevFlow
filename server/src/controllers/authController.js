const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../services/emailService");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateOTP();
    const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpires: codeExpires,
      lastVerificationSentAt: new Date(),
    });

    const emailDispatch = await sendVerificationEmail({
      toEmail: normalizedEmail,
      verificationCode,
      name: user.name,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please verify your email.",
      requiresVerification: true,
      email: user.email,
      previewCode: emailDispatch?.previewCode,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and 6-digit verification code are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+verificationCode +verificationCodeExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (user.isVerified) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        success: true,
        message: "Email is already verified",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: true,
        },
      });
    }

    if (user.verificationCode !== code.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code. Please check and try again.",
      });
    }

    if (user.verificationCodeExpires && new Date() > user.verificationCodeExpires) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    // Issue authenticated JWT session
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully. Welcome to DevFlow!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+verificationCode +verificationCodeExpires +lastVerificationSentAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "This account is already verified. Please sign in.",
      });
    }

    // Cooldown check: 60 seconds
    const now = new Date();
    if (user.lastVerificationSentAt && now - user.lastVerificationSentAt < 60000) {
      const waitSeconds = Math.ceil((60000 - (now - user.lastVerificationSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds}s before requesting another verification code.`,
      });
    }

    const verificationCode = generateOTP();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    user.lastVerificationSentAt = now;
    await user.save();

    const dispatchResult = await sendVerificationEmail({
      toEmail: normalizedEmail,
      verificationCode,
      name: user.name,
    });

    res.status(200).json({
      success: true,
      message: "A fresh verification code has been dispatched.",
      previewCode: dispatchResult?.previewCode,
    });
  } catch (error) {
    console.error("Resend verification error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while resending verification code",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check email verification status
    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        message: "Please verify your email address to access your workspace.",
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified !== false,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  verifyEmail,
  resendVerification,
  login,
};