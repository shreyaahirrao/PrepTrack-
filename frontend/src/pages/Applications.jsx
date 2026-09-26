import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Papa from "papaparse";
import {
  FiPlus, FiTrash2, FiEdit2, FiX, FiDownload,
  FiStar, FiChevronDown, FiChevronUp, FiUser, FiClock,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import EmptyState from "../components/EmptyState";

const STATUS_COLORS = {
  Applied: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200",
  OA: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  Interview: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  Offer: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

const emptyForm = {
  company: "",
  roleTitle: "",
  roleType: "Software/IT",
  status: "Applied",
  nextFollowUpDate: "",
  notes: "",
  priority: 3,
  referral: { name: "", linkedin: "", followedUp: false },
};

const PriorityStars = ({ value, onChange, readOnly = false }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={readOnly}
        onClick={() => onChange && onChange(n)}
        className={readOnly ? "cursor-default" : "cursor-pointer active:scale-90 transition-transform"}
      >
        <FiStar
          size={readOnly ? 14 : 20}
          className={n <= value ? "fill-warning text-warning" : "text-gray-300 dark:text-gray-600"}
        />
      </button>
    ))}
  </div>
);

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchApps = () => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter) params.append("status", statusFilter);
    if (typeFilter) params.append("roleType", typeFilter);
    api.get(`/applications?${params.toString()}`).then((res) => setApps(res.data));
  };

  useEffect(() => {
    const timer = setTimeout(fetchApps, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter, typeFilter]);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (app) => {
    setForm({
      company: app.company,
      roleTitle: app.roleTitle,
      roleType: app.roleType,
      status: app.status,
      nextFollowUpDate: app.nextFollowUpDate
        ? app.nextFollowUpDate.slice(0, 10)
        : "",
      notes: app.notes || "",
      priority: app.priority || 3,
      referral: app.referral || { name: "", linkedin: "", followedUp: false },
    });
    setEditingId(app._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/applications/${editingId}`, form);
        toast.success("Application updated");
      } else {
        await api.post("/applications", form);
        toast.success("Application added");
      }
      setShowModal(false);
      fetchApps();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this application?")) return;
    await api.delete(`/applications/${id}`);
    toast.success("Deleted");
    fetchApps();
  };

  const toggleFollowedUp = async (app) => {
    await api.put(`/applications/${app._id}`, {
      referral: { ...app.referral, followedUp: !app.referral?.followedUp },
    });
    fetchApps();
  };

  const addQuestion = async (appId) => {
    if (!newQuestion.trim()) return;
    await api.post(`/applications/${appId}/questions`, { question: newQuestion });
    setNewQuestion("");
    toast.success("Question added");
    fetchApps();
  };

  const exportCSV = () => {
    const rows = apps.map((app) => ({
      Company: app.company,
      Role: app.roleTitle,
      Type: app.roleType,
      Status: app.status,
      Priority: app.priority,
      "Applied Date": new Date(app.appliedDate).toLocaleDateString(),
      "Follow-up Date": app.nextFollowUpDate
        ? new Date(app.nextFollowUpDate).toLocaleDateString()
        : "",
      "Referral Name": app.referral?.name || "",
      Notes: app.notes || "",
    }));
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "preptrack-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Applications</h1>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              disabled={apps.length === 0}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 transition-all disabled:opacity-40"
            >
              <FiDownload /> Export CSV
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              <FiPlus /> Add Application
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option>Applied</option>
            <option>OA</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option>Core Engineering</option>
            <option>Software/IT</option>
            <option>Data Science</option>
            <option>Other</option>
          </select>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <EmptyState
              title="No applications found"
              subtitle="Try adjusting your filters, or add your first application"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {apps.map((app) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden ${
                    app.isOverdue
                      ? "border-red-200 dark:border-red-900"
                      : "border-gray-100 dark:border-gray-700"
                  }`}
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedId(expandedId === app._id ? null : app._id)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {app.company} <span className="text-gray-400 dark:text-gray-500 font-normal">— {app.roleTitle}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                            {app.status}
                          </span>
                          <PriorityStars value={app.priority} readOnly />
                          {app.referral?.name && (
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <FiUser size={12} /> {app.referral.name}
                            </span>
                          )}
                          {app.isOverdue && (
                            <span className="text-red-500 dark:text-red-400 text-xs font-medium">Overdue</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEdit(app); }}
                        className="text-gray-400 hover:text-primary"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(app._id); }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 />
                      </button>
                      {expandedId === app._id ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === app._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-gray-700 px-4 py-4 grid md:grid-cols-2 gap-6"
                      >
                        <div>
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <FiClock size={14} /> Status Timeline
                          </h4>
                          <div className="space-y-2">
                            {app.statusHistory?.length > 0 ? (
                              app.statusHistory.map((h, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                  <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[h.status]?.split(" ")[0] || "bg-gray-300"}`} />
                                  <span className="text-gray-600 dark:text-gray-300">{h.status}</span>
                                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-auto">
                                    {new Date(h.changedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400 dark:text-gray-500">No history yet</p>
                            )}
                          </div>

                          {app.referral?.name && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                              <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Referral</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{app.referral.name}</p>
                              
                             {app.referral.linkedin && (
  <span
    onClick={() => window.open(app.referral.linkedin, "_blank")}
    className="text-xs text-primary hover:underline cursor-pointer"
  >
    View LinkedIn
  </span>
)}
                              
                              <label className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <input
                                  type="checkbox"
                                  checked={app.referral.followedUp}
                                  onChange={() => toggleFollowedUp(app)}
                                  className="rounded"
                                />
                                Followed up with them
                              </label>
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Interview Questions Asked</h4>
                          <div className="space-y-1.5 mb-3 max-h-32 overflow-y-auto">
                            {app.interviewNotes?.questions?.length > 0 ? (
                              app.interviewNotes.questions.map((q, i) => (
                                <p key={i} className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-1.5">
                                  {q}
                                </p>
                              ))
                            ) : (
                              <p className="text-xs text-gray-400 dark:text-gray-500">No questions logged yet</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <input
                              placeholder="Add a question you were asked..."
                              value={newQuestion}
                              onChange={(e) => setNewQuestion(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && addQuestion(app._id)}
                              className="flex-1 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-1.5 text-sm"
                            />
                            <button
                              onClick={() => addQuestion(app._id)}
                              className="bg-primary text-white px-3 py-1.5 rounded-lg text-sm active:scale-95 transition-transform"
                            >
                              Add
                            </button>
                          </div>
                          {app.notes && (
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                              <h4 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">Notes</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{app.notes}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-20 px-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                  {editingId ? "Edit Application" : "New Application"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    placeholder="Role title"
                    value={form.roleTitle}
                    onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                    required
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <select
                    value={form.roleType}
                    onChange={(e) => setForm({ ...form, roleType: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
                  >
                    <option>Core Engineering</option>
                    <option>Software/IT</option>
                    <option>Data Science</option>
                    <option>Other</option>
                  </select>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
                  >
                    <option>Applied</option>
                    <option>OA</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Priority</label>
                    <PriorityStars value={form.priority} onChange={(n) => setForm({ ...form, priority: n })} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Next follow-up date</label>
                    <input
                      type="date"
                      value={form.nextFollowUpDate}
                      onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Referral name (optional)</label>
                    <input
                      placeholder="e.g. Priya Sharma"
                      value={form.referral.name}
                      onChange={(e) => setForm({ ...form, referral: { ...form.referral, name: e.target.value } })}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 mb-2"
                    />
                    <input
                      placeholder="LinkedIn URL (optional)"
                      value={form.referral.linkedin}
                      onChange={(e) => setForm({ ...form, referral: { ...form.referral, linkedin: e.target.value } })}
                      className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
                    />
                  </div>

                  <textarea
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg px-3 py-2"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all"
                  >
                    {editingId ? "Save changes" : "Add Application"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Applications;