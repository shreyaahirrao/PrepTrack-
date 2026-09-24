const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    branch: {
      type: String,
      required: true,
      // flexible — not locked to ENTC, any branch can type their own
      default: "General",
    },
    prepStartDate: { type: Date, default: Date.now },
    prepDurationWeeks: {
      type: Number,
      required: true,
      default: 26, // 6 months ≈ 26 weeks, but fully user-editable
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Virtual: prep end date, derived from start + duration
userSchema.virtual("prepEndDate").get(function () {
  const end = new Date(this.prepStartDate);
  end.setDate(end.getDate() + this.prepDurationWeeks * 7);
  return end;
});

userSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", userSchema);