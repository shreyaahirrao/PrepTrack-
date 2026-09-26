import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiClock, FiRefreshCw, FiSave } from "react-icons/fi";
import PageTransition from "../components/PageTransition";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    branch: user?.branch || "",
    prepDurationWeeks: user?.prepDurationWeeks || 26,
  });
  const [saving, setSaving] = useState(false);

  const prepStartDate = user?.prepStartDate ? new Date(user.prepStartDate) : null;
  const prepEndDate = prepStartDate
    ? new Date(prepStartDate.getTime() + form.prepDurationWeeks * 7 * 24 * 60 * 60 * 1000)
    : null;
  const daysRemaining = prepEndDate
    ? Math.max(0, Math.ceil((prepEndDate - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        branch: form.branch,
        prepDurationWeeks: form.prepDurationWeeks,
      });
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset your prep timeline to start from today?")) return;
    setSaving(true);
    try {
      await updateProfile({ resetStartDate: true });
      toast.success("Prep timeline reset — starting from today!");
    } catch (err) {
      toast.error("Reset failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-6">Profile & Settings</h1>

        {/* Account info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() || <FiUser />}
            </div>
            <div>
              <p className="font-bold text-lg">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Branch</label>
              <input
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Prep duration (weeks)</label>
              <input
                type="number"
                min="1"
                value={form.prepDurationWeeks}
                onChange={(e) => setForm({ ...form, prepDurationWeeks: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-gray-400 mt-1">
                Change this anytime — your days remaining will recalculate automatically.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              <FiSave /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>

        {/* Timeline card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiClock className="text-secondary" size={20} />
            <h2 className="font-bold">Prep Timeline</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-gray-400">Started on</p>
              <p className="font-medium">
                {prepStartDate ? prepStartDate.toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Ends on</p>
              <p className="font-medium">
                {prepEndDate ? prepEndDate.toLocaleDateString() : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Days remaining</p>
              <p className="font-medium text-primary">{daysRemaining ?? "—"} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Duration</p>
              <p className="font-medium">{form.prepDurationWeeks} weeks</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center justify-center gap-2 w-full bg-warning/10 text-warning py-2.5 rounded-lg font-medium hover:bg-warning/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <FiRefreshCw /> Reset Timeline to Start Today
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            This resets your start date to today, keeping your current duration. Useful if you fell behind and want a fresh countdown.
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Profile;