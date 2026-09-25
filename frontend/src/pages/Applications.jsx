import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { FiPlus, FiTrash2, FiEdit2, FiX, FiDownload } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import EmptyState from "../components/EmptyState";

const STATUS_COLORS = {
  Applied: "bg-gray-100 text-gray-700",
  OA: "bg-blue-100 text-blue-700",
  Interview: "bg-yellow-100 text-yellow-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const emptyForm = {
  company: "",
  roleTitle: "",
  roleType: "Software/IT",
  status: "Applied",
  nextFollowUpDate: "",
  notes: "",
};

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

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

  const exportCSV = () => {
    const rows = apps.map((app) => ({
      Company: app.company,
      Role: app.roleTitle,
      Type: app.roleType,
      Status: app.status,
      "Applied Date": new Date(app.appliedDate).toLocaleDateString(),
      "Follow-up Date": app.nextFollowUpDate
        ? new Date(app.nextFollowUpDate).toLocaleDateString()
        : "",
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
          <h1 className="text-2xl font-bold">Applications</h1>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              disabled={apps.length === 0}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-40"
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
            className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
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
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option>Core Engineering</option>
            <option>Software/IT</option>
            <option>Data Science</option>
            <option>Other</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {apps.length === 0 ? (
            <EmptyState
              title="No applications found"
              subtitle="Try adjusting your filters, or add your first application"
            />
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Follow-up</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {apps.map((app) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-t border-gray-100 ${
                        app.isOverdue ? "bg-red-50/50" : ""
                      }`}
                    >
                      <td className="px-5 py-3 font-medium">{app.company}</td>
                      <td className="px-5 py-3 text-gray-600">{app.roleTitle}</td>
                      <td className="px-5 py-3 text-gray-500">{app.roleType}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {app.nextFollowUpDate
                          ? new Date(app.nextFollowUpDate).toLocaleDateString()
                          : "—"}
                        {app.isOverdue && (
                          <span className="ml-2 text-red-500 text-xs font-medium">Overdue</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3 justify-end">
                          <button onClick={() => openEdit(app)} className="text-gray-400 hover:text-primary">
                            <FiEdit2 />
                          </button>
                          <button onClick={() => handleDelete(app._id)} className="text-gray-400 hover:text-red-500">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>

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
                className="bg-white rounded-2xl p-6 w-full max-w-md relative"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
                <h2 className="text-lg font-bold mb-4">
                  {editingId ? "Edit Application" : "New Application"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    placeholder="Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <input
                    placeholder="Role title"
                    value={form.roleTitle}
                    onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <select
                    value={form.roleType}
                    onChange={(e) => setForm({ ...form, roleType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option>Core Engineering</option>
                    <option>Software/IT</option>
                    <option>Data Science</option>
                    <option>Other</option>
                  </select>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option>Applied</option>
                    <option>OA</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Next follow-up date</label>
                    <input
                      type="date"
                      value={form.nextFollowUpDate}
                      onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <textarea
                    placeholder="Notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
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