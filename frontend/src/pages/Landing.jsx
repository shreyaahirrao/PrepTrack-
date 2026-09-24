import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBriefcase, FiMap, FiClock, FiTrendingUp, FiCheckCircle, FiUsers } from "react-icons/fi";
import PageTransition from "../components/PageTransition";

const features = [
  {
    icon: <FiBriefcase size={28} />,
    title: "Application Tracker",
    desc: "Log every application — company, role type, status — and never lose track of where you stand.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: <FiMap size={28} />,
    title: "Prep Roadmap Sync",
    desc: "Cross-reference your applications against your personal prep plan: topics, DSA problems, mock interviews.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: <FiClock size={28} />,
    title: "Flexible Duration",
    desc: "Not locked to 6 months — set your own prep timeline, whether it's 8 weeks or a full year.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: <FiTrendingUp size={28} />,
    title: "Visual Progress",
    desc: "See days remaining vs topics left at a glance, with an animated progress ring and bar.",
    color: "bg-success/10 text-success",
  },
  {
    icon: <FiCheckCircle size={28} />,
    title: "Auto-Flagged Follow-ups",
    desc: "Overdue follow-ups are surfaced automatically on your dashboard — nothing slips through.",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: <FiUsers size={28} />,
    title: "Any Branch, Any Role",
    desc: "Built for core engineering, software/IT, and data science tracks alike — not just one branch.",
    color: "bg-danger/10 text-danger",
  },
];

const Landing = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-secondary/10">
        {/* Hero */}
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Placement Prep, Organized
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-5 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
              PrepTrack
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The dashboard that ties your job applications directly to your prep roadmap —
              so you always know where you stand and what's next.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/30"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold text-lg border border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
              >
                Log In
              </Link>
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.svg
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewBox="0 0 500 260"
            className="w-full max-w-2xl mx-auto mt-14"
          >
            <rect x="30" y="40" width="200" height="180" rx="16" fill="#eef2ff" />
            <rect x="55" y="65" width="150" height="14" rx="7" fill="#a5b4fc" />
            <rect x="55" y="90" width="110" height="10" rx="5" fill="#c7d2fe" />
            <rect x="55" y="115" width="150" height="60" rx="8" fill="#ffffff" />
            <circle cx="80" cy="145" r="14" fill="#6366f1" />
            <rect x="105" y="138" width="80" height="8" rx="4" fill="#e0e7ff" />
            <rect x="105" y="152" width="50" height="8" rx="4" fill="#e0e7ff" />
            <rect x="55" y="190" width="60" height="16" rx="8" fill="#22d3ee" />

            <rect x="270" y="20" width="200" height="220" rx="16" fill="#ecfeff" />
            <circle cx="370" cy="90" r="45" fill="none" stroke="#22d3ee" strokeWidth="10" strokeDasharray="220" strokeDashoffset="60" strokeLinecap="round" transform="rotate(-90 370 90)" />
            <text x="370" y="96" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0e7490">72%</text>
            <rect x="295" y="150" width="150" height="10" rx="5" fill="#a5f3fc" />
            <rect x="295" y="170" width="110" height="10" rx="5" fill="#a5f3fc" />
            <rect x="295" y="190" width="130" height="10" rx="5" fill="#a5f3fc" />
            <circle cx="440" cy="45" r="20" fill="#f472b6" opacity="0.85" />
            <path d="M432 45l5 5 9-10" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        {/* Features grid */}
        <div className="max-w-5xl mx-auto px-6 pb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-10"
          >
            Everything your placement prep needs
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <div className="bg-gradient-to-r from-primary to-secondary py-14 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to organize your placement journey?</h2>
          <p className="text-white/90 mb-6">Free to use. Set up your roadmap in under two minutes.</p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary px-8 py-3 rounded-xl font-semibold text-lg hover:opacity-90 active:scale-95 transition-all"
          >
            Create Your Account
          </Link>
        </div>
      </div>
    </PageTransition>
  );
};

export default Landing;