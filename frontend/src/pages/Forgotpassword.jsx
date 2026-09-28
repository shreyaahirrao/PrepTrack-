import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import PageTransition from "../components/PageTransition";
import { FiMail } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Check your email for a reset link");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-gray-900 dark:to-gray-950 px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-primary" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-center mb-1 text-gray-900 dark:text-gray-100">
            Forgot your password?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6 text-sm">
            Enter your email and we'll send you a reset link.
          </p>

          {sent ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your inbox.
              </p>
              <Link to="/login" className="text-primary font-medium text-sm hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link to="/login" className="text-primary font-medium">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;