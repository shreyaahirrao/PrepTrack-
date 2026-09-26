const RoadmapTopic = require("../models/RoadmapTopic");
const Milestone = require("../models/Milestone");
const User = require("../models/User");

exports.createTopic = async (req, res) => {
  const topic = await RoadmapTopic.create({ ...req.body, user: req.user._id });
  res.status(201).json(topic);
};

exports.getTopics = async (req, res) => {
  const topics = await RoadmapTopic.find({ user: req.user._id }).sort({ targetDate: 1 });
  res.json(topics);
};

exports.updateTopic = async (req, res) => {
  const update = { ...req.body };
  if (update.completed) update.completedDate = new Date();
  const topic = await RoadmapTopic.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    update,
    { new: true }
  );
  if (!topic) return res.status(404).json({ message: "Not found" });
  res.json(topic);
};

exports.deleteTopic = async (req, res) => {
  const topic = await RoadmapTopic.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!topic) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

exports.getProgressSummary = async (req, res) => {
  const user = await User.findById(req.user._id);
  const topics = await RoadmapTopic.find({ user: req.user._id });
  const milestones = await Milestone.find({ user: req.user._id });

  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.completed).length;
  const topicsLeft = totalTopics - completedTopics;

  const now = new Date();
  const endDate = new Date(user.prepStartDate);
  endDate.setDate(endDate.getDate() + user.prepDurationWeeks * 7);
  const daysRemaining = Math.max(
    0,
    Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
  );

  const totalProblems = topics.reduce((sum, t) => sum + t.problemsTarget, 0);
  const solvedProblems = topics.reduce((sum, t) => sum + t.problemsSolved, 0);

  res.json({
    prepStartDate: user.prepStartDate,
    prepEndDate: endDate,
    daysRemaining,
    totalTopics,
    completedTopics,
    topicsLeft,
    percentComplete: totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0,
    totalProblems,
    solvedProblems,
    mockInterviewsCompleted: milestones.filter((m) => m.type === "Mock Interview").length,
  });
};

exports.createMilestone = async (req, res) => {
  const milestone = await Milestone.create({ ...req.body, user: req.user._id });
  res.status(201).json(milestone);
};

exports.getMilestones = async (req, res) => {
  const milestones = await Milestone.find({ user: req.user._id }).sort({ date: -1 });
  res.json(milestones);
};

exports.deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!milestone) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};