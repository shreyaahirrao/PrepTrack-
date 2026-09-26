import { motion } from "framer-motion";

const EmptyState = ({ title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-14 text-center"
  >
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 200 200"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="100" cy="100" r="90" fill="#eef2ff" />
      <rect x="55" y="70" width="90" height="70" rx="8" fill="#c7d2fe" />
      <rect x="65" y="85" width="70" height="8" rx="4" fill="#6366f1" />
      <rect x="65" y="100" width="50" height="8" rx="4" fill="#a5b4fc" />
      <circle cx="140" cy="65" r="18" fill="#22d3ee" opacity="0.8" />
      <path d="M133 65l5 5 9-10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
    <h3 className="text-gray-600 dark:text-gray-300 font-medium mt-4">{title}</h3>
    {subtitle && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
  </motion.div>
);

export default EmptyState;