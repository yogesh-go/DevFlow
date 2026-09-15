const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 6,
    },

    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    avatar: {
      type: String,
      default: "",
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationCode: {
      type: String,
      select: false,
    },

    verificationCodeExpires: {
      type: Date,
      select: false,
    },

    lastVerificationSentAt: {
      type: Date,
      select: false,
    },

    targetRole: {
      type: String,
      default: "Software Engineer",
      trim: true,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    experienceLevel: {
      type: String,
      enum: ["Entry Level", "Intermediate", "Senior", "Lead / Staff"],
      default: "Intermediate",
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;