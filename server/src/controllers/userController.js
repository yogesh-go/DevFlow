const User = require("../models/User");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, targetRole, skills, experienceLevel, bio } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined && name.trim()) {
      user.name = name.trim();
    }
    if (targetRole !== undefined) {
      user.targetRole = targetRole.trim();
    }
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean)
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : user.skills;
    }
    if (experienceLevel !== undefined) {
      const allowed = ["Entry Level", "Intermediate", "Senior", "Lead / Staff"];
      if (allowed.includes(experienceLevel)) {
        user.experienceLevel = experienceLevel;
      }
    }
    if (bio !== undefined) {
      user.bio = typeof bio === "string" ? bio.trim() : "";
    }

    await user.save();

    const sanitized = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: sanitized,
    });
  } catch (error) {
    console.error("Update user profile error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
};