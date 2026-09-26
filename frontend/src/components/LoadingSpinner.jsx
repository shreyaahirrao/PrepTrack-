import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-10 h-10 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full"
    />
  </div>
);

export default LoadingSpinner;