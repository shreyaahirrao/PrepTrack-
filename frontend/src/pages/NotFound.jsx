import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import PageTransition from "../components/PageTransition";

const NotFound = () => (
  <PageTransition>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-gray-950 dark:to-gray-900 px-4 text-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-8xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4"
      >
        404
      </motion.div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 active:scale-95 transition-all"
      >
        <FiHome /> Back to Dashboard
      </Link>
    </div>
  </PageTransition>
);

export default NotFound;