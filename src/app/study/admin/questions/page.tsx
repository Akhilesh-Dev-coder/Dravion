"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HelpCircle, Plus, ArrowLeft, Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      setErrorMsg(null);
      const [qRes, subRes] = await Promise.all([
        fetch("/api/study/admin/questions"),
        fetch("/api/study/admin/subjects"),
      ]);
      const qData = await qRes.json();
      const subData = await subRes.json();

      if (!qRes.ok || !subRes.ok) {
        throw new Error(qData.error || subData.error || "Failed to fetch questions");
      }

      setQuestions(qData.questions || []);
      setSubjects(subData.subjects || []);
      if (subData.subjects?.length > 0 && !subjectId) {
        setSubjectId(subData.subjects[0]._id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setErrorMsg(null);
    setEditingId(null);
    setQuestion("");
    setAnswer("");
    setShowModal(true);
  };

  const openEditModal = (q: any) => {
    setErrorMsg(null);
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
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/study/admin/questions/${editingId}` : "/api/study/admin/questions";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, subjectId, marks, year }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save question");
      }

      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/study/admin/questions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete question");
      }
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete question");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/study/admin"
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" /> Important Exam Questions
            </h1>
            <p className="text-sm text-slate-500">Add, edit, or delete key exam questions and model solutions.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
          No exam questions found. Click &quot;Add Question&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q._id} className="bg-white border border-slate-200 hover:border-blue-300 p-5 rounded-2xl space-y-3 shadow-sm hover:shadow transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ⭐ {q.marks || 5} Marks ({q.subjectId?.name || "Subject"})
                  </span>
                  {q.year && <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">Year {q.year}</span>}
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{q.question}</h3>
                {q.answer && <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{q.answer}</p>}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(q)}
                  className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="p-2 bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-rose-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Question" : "Add Important Exam Question"}</h2>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Question Text</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Explain String immutability in Java."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none h-20"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Answer Key / Hints</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Model answer..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none h-20"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Assign Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
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
                  <label className="text-slate-700 font-semibold block mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Exam Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-sm cursor-pointer"
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
