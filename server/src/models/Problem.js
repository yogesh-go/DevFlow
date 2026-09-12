const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Problem title is required"],
      trim: true,
    },

    platform: {
      type: String,
      enum: [
        "LeetCode",
        "Codeforces",
        "CodeChef",
        "GeeksforGeeks",
        "HackerRank",
        "Other",
      ],
      default: "LeetCode",
    },

    problemUrl: {
      type: String,
      trim: true,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: [true, "Difficulty is required"],
      default: "Medium",
    },

    topic: {
      type: String,
      enum: [
        "Arrays",
        "Strings",
        "Two Pointers",
        "Sliding Window",
        "Linked List",
        "Stack",
        "Queue",
        "Trees",
        "Graphs",
        "DP",
        "Greedy",
        "Binary Search",
        "Backtracking",
        "Heap",
        "Trie",
        "Bit Manipulation",
        "Math",
        "Other",
      ],
      required: [true, "Topic is required"],
      default: "Arrays",
    },

    status: {
      type: String,
      enum: ["Not Started", "Attempted", "Solved", "Need Revision"],
      default: "Not Started",
    },

    revisionCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number, // in minutes
      default: 0,
      min: 0,
    },

    solvedDate: {
      type: Date,
      default: null,
    },

    lastRevisedDate: {
      type: Date,
      default: null,
    },

    nextRevisionDate: {
      type: Date,
      default: null,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for scalable querying and filtering
problemSchema.index({ user: 1, status: 1 });
problemSchema.index({ user: 1, topic: 1 });
problemSchema.index({ user: 1, difficulty: 1 });
problemSchema.index({ user: 1, platform: 1 });
problemSchema.index({ user: 1, createdAt: -1 });

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;
