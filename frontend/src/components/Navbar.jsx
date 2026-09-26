import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiGrid, FiBriefcase, FiMap, FiUser, FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid size={20} /> },
    { to: "/applications", label: "Applications", icon: <FiBriefcase size={20} /> },
    { to: "/roadmap", label: "Roadmap", icon: <FiMap size={20} /> },
    { to: "/profile", label: "Profile", icon: <FiUser size={20} /> },
  ];

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
        >
          PrepTrack
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 text-lg font-semibold transition-colors ${
                  active ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-primary"
                }`}
              >
                {link.icon} {link.label}
                {active && (
                  <motion.div
                    layoutId="navUnderline"
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                )}
              </Link>
            );
          })}
          <span className="text-base text-gray-400 dark:text-gray-500 font-medium">Hi, {user?.name} 👋</span>
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:opacity-80 active:scale-95 transition-all"
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-lg font-semibold text-danger hover:opacity-80 active:scale-95 transition-all"
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleDark}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 active:scale-95 transition-all"
          >
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 active:scale-95 transition-all"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden mt-4"
          >
            <div className="flex flex-col gap-1 pb-2">
              {links.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {link.icon} {link.label}
                  </Link>
                );
              })}
              <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 mt-1 pt-3">
                Hi, {user?.name} 👋
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-danger hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition-all text-left"
              >
                <FiLogOut size={20} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;