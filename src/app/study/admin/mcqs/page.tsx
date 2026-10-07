"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Plus, ArrowLeft, Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";

export default function AdminMCQsPage() {
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("0");
  const [explanation, setExplanation] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setErrorMsg(null);
      const [mcqRes, subRes] = await Promise.all([
        fetch("/api/study/admin/mcqs"),
        fetch("/api/study/admin/subjects"),
      ]);
      const mcqData = await mcqRes.json();
      const subData = await subRes.json();

      if (!mcqRes.ok || !subRes.ok) {
        throw new Error(mcqData.error || subData.error || "Failed to fetch MCQs");
      }

      setMcqs(mcqData.mcqs || []);
      setSubjects(subData.subjects || []);
      if (subData.subjects?.length > 0 && !subjectId) {
        setSubjectId(subData.subjects[0]._id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load MCQs");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setErrorMsg(null);
    setEditingId(null);
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("0");
    setExplanation("");
    setShowModal(true);
  };

  const openEditModal = (m: any) => {
    setErrorMsg(null);
    setEditingId(m._id);
    setQuestion(m.question);
    setOptionA(m.options?.[0] || "");
    setOptionB(m.options?.[1] || "");
    setOptionC(m.options?.[2] || "");
    setOptionD(m.options?.[3] || "");
    setCorrectAnswer((m.correctAnswer || 0).toString());
    setExplanation(m.explanation || "");
    setSubjectId(m.subjectId?._id || m.subjectId);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !optionA || !optionB || !subjectId) return;
    setSaving(true);
    setErrorMsg(null);

    try {
      const options = [optionA, optionB];
      if (optionC) options.push(optionC);
      if (optionD) options.push(optionD);

      const url = editingId ? `/api/study/admin/mcqs/${editingId}` : "/api/study/admin/mcqs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options,
          correctAnswer: parseInt(correctAnswer),
          explanation,
          subjectId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save MCQ");
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
    if (!confirm("Are you sure you want to delete this MCQ?")) return;
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/study/admin/mcqs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete MCQ");
      }
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete MCQ");
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
              <Award className="w-6 h-6 text-blue-600" /> Multiple Choice Questions (MCQs)
            </h1>
            <p className="text-sm text-slate-500">Manage practice MCQs and detailed answer explanations.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add MCQ</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading practice MCQs...</div>
      ) : mcqs.length === 0 ? (
        <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
          No MCQs found. Click &quot;Add MCQ&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {mcqs.map((m, idx) => (
            <div key={m._id} className="bg-white border border-slate-200 hover:border-blue-300 p-5 rounded-2xl space-y-4 shadow-sm hover:shadow transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Q{idx + 1} • {m.subjectId?.name || "Subject"}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{m.question}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {m.options?.map((opt: string, optIdx: number) => (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl border ${
                        optIdx === m.correctAnswer
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  ))}
                </div>
                {m.explanation && (
                  <p className="text-xs text-blue-800 bg-blue-50/80 p-3 rounded-xl border border-blue-200 leading-relaxed">
                    <strong className="font-semibold">Explanation:</strong> {m.explanation}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit MCQ" : "Add Practice MCQ"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Question Text</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is a String in Java?"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none h-16"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Option A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Primitive datatype"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Option B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Class"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Option C (Optional)</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Operator"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Option D (Optional)</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Package"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Correct Option Index</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="0">Option A</option>
                  <option value="1">Option B</option>
                  <option value="2">Option C</option>
                  <option value="3">Option D</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Explanation</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why this answer is correct..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none h-16"
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update MCQ" : "Save MCQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
