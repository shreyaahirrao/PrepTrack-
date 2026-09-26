const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  getProgressSummary,
  createMilestone,
  getMilestones,
  deleteMilestone,
} = require("../controllers/roadmapController");

router.use(protect);
router.route("/topics").post(createTopic).get(getTopics);
router.route("/topics/:id").put(updateTopic).delete(deleteTopic);
router.get("/progress", getProgressSummary);
router.route("/milestones").post(createMilestone).get(getMilestones);
router.delete("/milestones/:id", deleteMilestone);

module.exports = router;