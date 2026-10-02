"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Plus, ArrowLeft, Loader2, Edit2, Trash2 } from "lucide-react";

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subRes, semRes] = await Promise.all([
        fetch("/api/study/admin/subjects"),
        fetch("/api/study/admin/semesters"),
      ]);
      const subData = await subRes.json();
      const semData = await semRes.json();
      setSubjects(subData.subjects || []);
      setSemesters(semData.semesters || []);
      if (semData.semesters?.length > 0) {
        setSemesterId(semData.semesters[0]._id);
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
    setCode("");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (sub: any) => {
    setEditingId(sub._id);
    setName(sub.name);
    setCode(sub.code);
    setSemesterId(sub.semesterId?._id || sub.semesterId);
    setDescription(sub.description || "");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !semesterId) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/study/admin/subjects/${editingId}` : "/api/study/admin/subjects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, semesterId, description }),
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
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      const res = await fetch(`/api/study/admin/subjects/${id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-bold text-white">Subject Management</h1>
            <p className="text-xs text-gray-400">Add and edit subjects assigned to academic semesters.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading subjects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div key={sub._id} className="bg-[#141720] border border-white/10 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {sub.code}
                  </span>
                  <span className="text-xs text-gray-400">{sub.semesterId?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-white">{sub.name}</h2>
                <p className="text-xs text-gray-400 line-clamp-2">{sub.description || "No description."}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(sub)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
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
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit Subject" : "Add New Subject"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Subject Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Subject Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS601"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Assign Semester</label>
                <select
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                >
                  {semesters.map((sem) => (
                    <option key={sem._id} value={sem._id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course description..."
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Subject" : "Save Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
