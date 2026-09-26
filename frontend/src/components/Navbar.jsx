import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { FiLogOut, FiGrid, FiBriefcase, FiMap, FiUser, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggleDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

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
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <Link
        to="/dashboard"
        className="text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
      >
        PrepTrack
      </Link>
      <div className="flex items-center gap-8">
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
    </nav>
  );
};

export default Navbar;