const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["Mock Interview", "Resume Review", "Test Series", "Custom"],
      default: "Custom",
    },
    title: { type: String, required: true },
    date: { type: Date, default: Date.now },
    feedback: { type: String },
    rating: { type: Number, min: 1, max: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);