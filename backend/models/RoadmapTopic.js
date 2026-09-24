const mongoose = require("mongoose");

const roadmapTopicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, // e.g. "Arrays & Strings", "Signals & Systems", "SQL Joins"
    category: {
      type: String, // user-defined free text, so any branch fits: "DSA", "Core Subject", "Aptitude", "Project", etc.
      required: true,
    },
    targetDate: { type: Date }, // when they plan to finish it, within their custom duration
    completed: { type: Boolean, default: false },
    completedDate: { type: Date },
    problemsSolved: { type: Number, default: 0 }, // for DSA-style topics
    problemsTarget: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoadmapTopic", roadmapTopicSchema);