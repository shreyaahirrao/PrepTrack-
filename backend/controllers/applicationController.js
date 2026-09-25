const Application = require("../models/Application");

exports.createApplication = async (req, res) => {
  try {
    const app = await Application.create({ ...req.body, user: req.user._id });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { status, roleType, search } = req.query;
    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (roleType) filter.roleType = roleType;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { roleTitle: { $regex: search, $options: "i" } },
      ];
    }

    const apps = await Application.find(filter).sort({ appliedDate: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOverdueFollowUps = async (req, res) => {
  try {
    const apps = await Application.find({
      user: req.user._id,
      nextFollowUpDate: { $lt: new Date() },
      status: { $nin: ["Offer", "Rejected"] },
    });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};