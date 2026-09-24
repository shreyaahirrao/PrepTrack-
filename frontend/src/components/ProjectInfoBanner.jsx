import { motion } from "framer-motion";
import { FiTarget, FiTrendingUp, FiClock } from "react-icons/fi";

const ProjectInfoBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl p-6 mb-6 text-white shadow-lg"
  >
    <h2 className="text-xl font-bold mb-1">Welcome to PrepTrack 🎯</h2>
    <p className="text-white/90 text-sm mb-4">
      Your placement prep and application tracker — built for every branch, on your own timeline.
    </p>
    <div className="flex flex-wrap gap-6">
      <div className="flex items-center gap-2 text-sm">
        <FiTarget /> Track every application
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FiTrendingUp /> Sync with your prep roadmap
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FiClock /> Flexible duration, any branch
      </div>
    </div>
  </motion.div>
);

export default ProjectInfoBanner;