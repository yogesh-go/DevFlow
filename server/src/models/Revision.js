const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema(
  {
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
      index: true,
    },

    completedDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
      index: true,
    },

    revisionNumber: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },

    intervalDays: {
      type: Number,
      required: true,
    },

    confidence: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

revisionSchema.index({ user: 1, scheduledDate: 1, status: 1 });

const Revision = mongoose.model("Revision", revisionSchema);

module.exports = Revision;
