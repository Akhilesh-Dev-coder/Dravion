"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, ArrowLeft, Loader2, Edit2, Trash2, AlertCircle } from "lucide-react";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [chapterNumber, setChapterNumber] = useState("1");
  const [subjectId, setSubjectId] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setErrorMsg(null);
      const [chRes, subRes] = await Promise.all([
        fetch("/api/study/admin/chapters"),
        fetch("/api/study/admin/subjects"),
      ]);
      const chData = await chRes.json();
      const subData = await subRes.json();

      if (!chRes.ok || !subRes.ok) {
        throw new Error(chData.error || subData.error || "Failed to fetch chapters");
      }

      setChapters(chData.chapters || []);
      setSubjects(subData.subjects || []);
      if (subData.subjects?.length > 0 && !subjectId) {
        setSubjectId(subData.subjects[0]._id);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to load chapters");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setErrorMsg(null);
    setEditingId(null);
    setName("");
    setChapterNumber("1");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (ch: any) => {
    setErrorMsg(null);
    setEditingId(ch._id);
    setName(ch.name);
    setChapterNumber(ch.chapterNumber.toString());
    setSubjectId(ch.subjectId?._id || ch.subjectId);
    setDescription(ch.description || "");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !chapterNumber || !subjectId) return;
    setSaving(true);
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/study/admin/chapters/${editingId}` : "/api/study/admin/chapters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, chapterNumber, subjectId, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save chapter");
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
    if (!confirm("Are you sure you want to delete this chapter?")) return;
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/study/admin/chapters/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete chapter");
      }
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete chapter");
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
              <Layers className="w-6 h-6 text-blue-600" /> Chapter Management
            </h1>
            <p className="text-sm text-slate-500">Add chapter modules under subjects.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading chapters...</div>
      ) : chapters.length === 0 ? (
        <div className="py-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500">
          No chapters found. Click &quot;Add Chapter&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((ch) => (
            <div key={ch._id} className="bg-white border border-slate-200 hover:border-blue-300 p-5 rounded-2xl space-y-4 shadow-sm hover:shadow transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Chapter {ch.chapterNumber}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{ch.subjectId?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{ch.name}</h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ch.description || "No description."}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(ch)}
                  className="p-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(ch._id)}
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
            <h2 className="text-lg font-bold text-slate-900">{editingId ? "Edit Chapter" : "Add New Chapter"}</h2>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-700 font-semibold block mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. String Class and Immutability"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Chapter Number</label>
                <input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  placeholder="1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
                  required
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
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-semibold block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chapter topics..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none h-20"
                />
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Chapter" : "Save Chapter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
