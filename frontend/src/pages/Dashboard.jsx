import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import AnimatedNumber from "../components/AnimatedNumber";
import Skeleton from "../components/Skeleton";
import ProgressRing from "../components/ProgressRing";
import ProjectInfoBanner from "../components/ProjectInfoBanner";
import StatusChart from "../components/StatusChart";

const Dashboard = () => {
  const [progress, setProgress] = useState(null);
  const [overdue, setOverdue] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/roadmap/progress").then((res) => setProgress(res.data));
    api.get("/applications/overdue").then((res) => setOverdue(res.data));
    api.get("/applications").then((res) => setApplications(res.data));
  }, []);

  if (!progress) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <ProjectInfoBanner />
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Progress</h1>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <ProgressRing percent={progress.percentComplete} />
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mb-2 text-center sm:text-left">
                <span className="text-gray-600 dark:text-gray-300 font-medium text-sm sm:text-base">
                  {progress.completedTopics} / {progress.totalTopics} topics done
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">{progress.daysRemaining} days remaining</span>
              </div>
              <div className="w-full h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress.percentComplete}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center sm:text-left">{progress.percentComplete}% complete</p>
            </div>
          </div>
        </div>

        <StatusChart applications={applications} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Topics Left" value={progress.topicsLeft} color="text-warning" />
          <StatCard
            label="DSA Problems"
            value={`${progress.solvedProblems}/${progress.totalProblems}`}
            color="text-secondary"
          />
          <StatCard label="Mock Interviews" value={progress.mockInterviewsCompleted} color="text-success" />
        </div>

        {overdue.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-4 sm:p-5">
            <h2 className="text-red-600 dark:text-red-400 font-semibold mb-2 text-sm sm:text-base">
              ⚠ {overdue.length} overdue follow-up{overdue.length > 1 ? "s" : ""}
            </h2>
            <ul className="space-y-1">
              {overdue.map((app) => (
                <li key={app._id} className="text-sm text-red-500 dark:text-red-400">
                  {app.company} — {app.roleTitle}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

const StatCard = ({ label, value, color = "text-primary" }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-5 text-center"
  >
    <p className={`text-xl sm:text-2xl font-bold ${color}`}>
      {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
  </motion.div>
);

export default Dashboard;