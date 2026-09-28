import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Applications = lazy(() => import("./pages/Applications"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

const KNOWN_ROUTES = [
  "/",
  "/login",
  "/register",
  "/dashboard",
  "/applications",
  "/roadmap",
  "/profile",
];

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isPublicPage =
    ["/", "/login", "/register", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password");
  const isKnownRoute = KNOWN_ROUTES.includes(location.pathname);
  const showNavbar = user && !isPublicPage && isKnownRoute;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Toaster position="top-right" />
      {showNavbar && <Navbar />}
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                loading ? null : user ? <Navigate to="/dashboard" replace /> : <Landing />
              }
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" replace /> : <Register />}
            />
            <Route
              path="/forgot-password"
              element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
            />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default App;