"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, Plus, ArrowLeft, Loader2, Edit2, Trash2 } from "lucide-react";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [marks, setMarks] = useState("5");
  const [year, setYear] = useState("2025");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [qRes, subRes] = await Promise.all([
        fetch("/api/study/admin/questions"),
        fetch("/api/study/admin/subjects"),
      ]);
      const qData = await qRes.json();
      const subData = await subRes.json();
      setQuestions(qData.questions || []);
      setSubjects(subData.subjects || []);
      if (subData.subjects?.length > 0) setSubjectId(subData.subjects[0]._id);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setShowModal(true);
  };

  const openEditModal = (q: any) => {
    setEditingId(q._id);
    setQuestion(q.question);
    setAnswer(q.answer || "");
    setSubjectId(q.subjectId?._id || q.subjectId);
    setMarks((q.marks || 5).toString());
    setYear((q.year || 2025).toString());
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !subjectId) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/study/admin/questions/${editingId}` : "/api/study/admin/questions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, subjectId, marks, year }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/study/admin/questions/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/study/admin"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Important Exam Questions Management</h1>
            <p className="text-xs text-gray-400">Add, edit, or delete key exam questions and model solutions.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading questions...</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q._id} className="bg-[#141720] border border-white/10 p-5 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ⭐ {q.marks || 5} Marks ({q.subjectId?.name})
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{q.question}</h3>
                {q.answer && <p className="text-xs text-gray-400 bg-black/40 p-3 rounded-lg">{q.answer}</p>}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(q)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="p-2 bg-white/5 hover:bg-rose-500/20 border border-white/10 text-gray-300 hover:text-rose-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#141720] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit Question" : "Add Important Exam Question"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Question Text</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Explain String immutability in Java."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-20"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Answer Key / Hints</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Model answer..."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-20"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Assign Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Question" : "Save Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
