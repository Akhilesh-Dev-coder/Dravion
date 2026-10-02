"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Plus, ArrowLeft, Loader2, Edit2, Trash2 } from "lucide-react";

export default function AdminMCQsPage() {
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const [mcqRes, subRes] = await Promise.all([
        fetch("/api/study/admin/mcqs"),
        fetch("/api/study/admin/subjects"),
      ]);
      const mcqData = await mcqRes.json();
      const subData = await subRes.json();
      setMcqs(mcqData.mcqs || []);
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
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("0");
    setExplanation("");
    setShowModal(true);
  };

  const openEditModal = (m: any) => {
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
    if (!confirm("Are you sure you want to delete this MCQ?")) return;
    try {
      const res = await fetch(`/api/study/admin/mcqs/${id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-bold text-white">Multiple Choice Questions (MCQs)</h1>
            <p className="text-xs text-gray-400">Manage practice MCQs and detailed answer explanations.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add MCQ</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading practice MCQs...</div>
      ) : (
        <div className="space-y-4">
          {mcqs.map((m, idx) => (
            <div key={m._id} className="bg-[#141720] border border-white/10 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                    Q{idx + 1} • {m.subjectId?.name}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{m.question}</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {m.options?.map((opt: string, optIdx: number) => (
                    <div
                      key={optIdx}
                      className={`p-2 rounded border ${
                        optIdx === m.correctAnswer
                          ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold"
                          : "bg-black/30 border-white/5 text-gray-300"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                    </div>
                  ))}
                </div>
                {m.explanation && (
                  <p className="text-xs text-blue-300 bg-blue-500/10 p-2.5 rounded border border-blue-500/20">
                    <strong>Explanation:</strong> {m.explanation}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(m)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
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
          <div className="bg-[#141720] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit MCQ" : "Add Practice MCQ"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Question Text</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="What is a String in Java?"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-16"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Option A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Primitive datatype"
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Option B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Class"
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Option C (Optional)</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Operator"
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Option D (Optional)</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Package"
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Correct Option Index</label>
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
                >
                  <option value="0">Option A</option>
                  <option value="1">Option B</option>
                  <option value="2">Option C</option>
                  <option value="3">Option D</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Explanation</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Why this answer is correct..."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-16"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Assign Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white"
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
                  className="px-4 py-2 bg-white/5 text-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold"
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
