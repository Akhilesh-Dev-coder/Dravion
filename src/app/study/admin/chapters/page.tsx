"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, ArrowLeft, Loader2, Edit2, Trash2 } from "lucide-react";

export default function AdminChaptersPage() {
  const [chapters, setChapters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
      const [chRes, subRes] = await Promise.all([
        fetch("/api/study/admin/chapters"),
        fetch("/api/study/admin/subjects"),
      ]);
      const chData = await chRes.json();
      const subData = await subRes.json();
      setChapters(chData.chapters || []);
      setSubjects(subData.subjects || []);
      if (subData.subjects?.length > 0) {
        setSubjectId(subData.subjects[0]._id);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setChapterNumber("1");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (ch: any) => {
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
    try {
      const url = editingId ? `/api/study/admin/chapters/${editingId}` : "/api/study/admin/chapters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, chapterNumber, subjectId, description }),
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
    if (!confirm("Are you sure you want to delete this chapter?")) return;
    try {
      const res = await fetch(`/api/study/admin/chapters/${id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-bold text-white">Chapter Management</h1>
            <p className="text-xs text-gray-400">Add chapter modules under subjects.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading chapters...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((ch) => (
            <div key={ch._id} className="bg-[#141720] border border-white/10 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Chapter {ch.chapterNumber}
                  </span>
                  <span className="text-xs text-gray-400">{ch.subjectId?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{ch.name}</h2>
                <p className="text-xs text-gray-400 line-clamp-2">{ch.description || "No description."}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(ch)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(ch._id)}
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
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit Chapter" : "Add New Chapter"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Chapter Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. String Class and Immutability"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Chapter Number</label>
                <input
                  type="number"
                  value={chapterNumber}
                  onChange={(e) => setChapterNumber(e.target.value)}
                  placeholder="1"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
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
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chapter topics..."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-20"
                />
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
