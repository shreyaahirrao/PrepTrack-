import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { FiPlus, FiCheck, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import EmptyState from "../components/EmptyState";

const Roadmap = () => {
  const [topics, setTopics] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [newTopic, setNewTopic] = useState({ title: "", category: "", problemsTarget: 0 });
  const [newMilestone, setNewMilestone] = useState({ type: "Mock Interview", title: "" });

  const fetchAll = () => {
    api.get("/roadmap/topics").then((res) => setTopics(res.data));
    api.get("/roadmap/milestones").then((res) => setMilestones(res.data));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const addTopic = async (e) => {
    e.preventDefault();
    if (!newTopic.title || !newTopic.category) return;
    await api.post("/roadmap/topics", newTopic);
    setNewTopic({ title: "", category: "", problemsTarget: 0 });
    toast.success("Topic added");
    fetchAll();
  };

  const toggleComplete = async (topic) => {
    await api.put(`/roadmap/topics/${topic._id}`, { completed: !topic.completed });
    fetchAll();
  };

  const deleteTopic = async (id) => {
    await api.delete(`/roadmap/topics/${id}`);
    fetchAll();
  };

  const incrementSolved = async (topic) => {
    if (topic.problemsSolved >= topic.problemsTarget) {
      toast.success("Target already reached! 🎉");
      return;
    }
    await api.put(`/roadmap/topics/${topic._id}`, {
      problemsSolved: topic.problemsSolved + 1,
    });
    fetchAll();
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.title) return;
    await api.post("/roadmap/milestones", newMilestone);
    setNewMilestone({ type: "Mock Interview", title: "" });
    toast.success("Milestone logged");
    fetchAll();
  };

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        {/* Topics */}
        <div>
          <h2 className="text-xl font-bold mb-4">Prep Topics</h2>
          <form onSubmit={addTopic} className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl border border-gray-100">
            <input
              placeholder="Topic title (e.g. Dynamic Programming)"
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Category (e.g. DSA, Core Subject, Aptitude)"
              value={newTopic.category}
              onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Problems target (optional)"
              value={newTopic.problemsTarget}
              onChange={(e) => setNewTopic({ ...newTopic, problemsTarget: Number(e.target.value) })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button className="flex items-center justify-center gap-1.5 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all">
              <FiPlus /> Add Topic
            </button>
          </form>

          {topics.length === 0 ? (
            <EmptyState title="No topics yet" subtitle="Add a topic to start building your roadmap" />
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {topics.map((t) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className={`p-3 rounded-xl border ${
                      t.completed ? "bg-green-50 border-green-100" : "bg-white border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${t.completed ? "line-through text-gray-400" : ""}`}>
                          {t.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t.category}
                          {t.problemsTarget > 0 && ` · ${t.problemsSolved}/${t.problemsTarget} problems`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {t.problemsTarget > 0 && (
                          <button
                            onClick={() => incrementSolved(t)}
                            title="Add 1 solved problem"
                            className="p-1.5 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 active:scale-90 transition-all"
                          >
                            <FiTrendingUp size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => toggleComplete(t)}
                          className={`p-1.5 rounded-full active:scale-90 transition-transform ${
                            t.completed ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <FiCheck size={14} />
                        </button>
                        <button
                          onClick={() => deleteTopic(t._id)}
                          className="p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-red-500 active:scale-90 transition-transform"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {t.problemsTarget > 0 && (
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (t.problemsSolved / t.problemsTarget) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div>
          <h2 className="text-xl font-bold mb-4">Milestones</h2>
          <form onSubmit={addMilestone} className="flex flex-col gap-2 mb-4 bg-white p-4 rounded-xl border border-gray-100">
            <select
              value={newMilestone.type}
              onChange={(e) => setNewMilestone({ ...newMilestone, type: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option>Mock Interview</option>
              <option>Resume Review</option>
              <option>Test Series</option>
              <option>Custom</option>
            </select>
            <input
              placeholder="Title (e.g. Mock with senior at Infosys)"
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <button className="flex items-center justify-center gap-1.5 bg-secondary text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all">
              <FiPlus /> Log Milestone
            </button>
          </form>

          {milestones.length === 0 ? (
            <EmptyState title="No milestones yet" subtitle="Log a mock interview or resume review" />
          ) : (
            <div className="space-y-2">
              {milestones.map((m) => (
                <div key={m._id} className="p-3 rounded-xl border border-gray-100 bg-white">
                  <p className="font-medium text-sm">{m.title}</p>
                  <p className="text-xs text-gray-400">
                    {m.type} · {new Date(m.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Roadmap;