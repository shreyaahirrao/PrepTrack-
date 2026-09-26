const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    roleTitle: { type: String, required: true },
    roleType: {
      type: String,
      enum: ["Core Engineering", "Software/IT", "Data Science", "Other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "OA", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    appliedDate: { type: Date, default: Date.now },
    nextFollowUpDate: { type: Date },
    notes: { type: String },

    priority: { type: Number, min: 1, max: 5, default: 3 },

    referral: {
      name: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      followedUp: { type: Boolean, default: false },
    },

    interviewNotes: {
      questions: [{ type: String }],
      interviewerNotes: { type: String, default: "" },
      rounds: { type: Number, default: 0 },
    },

    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applicationSchema.virtual("isOverdue").get(function () {
  if (!this.nextFollowUpDate) return false;
  if (["Offer", "Rejected"].includes(this.status)) return false;
  return new Date() > this.nextFollowUpDate;
});

applicationSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Application", applicationSchema);