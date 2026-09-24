const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
  getOverdueFollowUps,
} = require("../controllers/applicationController");

router.use(protect);
router.route("/").post(createApplication).get(getApplications);
router.get("/overdue", getOverdueFollowUps);
router.route("/:id").put(updateApplication).delete(deleteApplication);

module.exports = router;