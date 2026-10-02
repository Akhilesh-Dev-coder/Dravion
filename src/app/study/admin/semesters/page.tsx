"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, ArrowLeft, Loader2, Check, Edit2, Trash2 } from "lucide-react";

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/study/admin/semesters");
      const data = await res.json();
      setSemesters(data.semesters || []);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setNumber("");
    setDescription("");
    setShowModal(true);
  };

  const openEditModal = (sem: any) => {
    setEditingId(sem._id);
    setName(sem.name);
    setNumber(sem.number.toString());
    setDescription(sem.description || "");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !number) return;
    setSaving(true);
    try {
      const url = editingId ? `/api/study/admin/semesters/${editingId}` : "/api/study/admin/semesters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number, description }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchSemesters();
      }
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this semester?")) return;
    try {
      const res = await fetch(`/api/study/admin/semesters/${id}`, { method: "DELETE" });
      if (res.ok) fetchSemesters();
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
            <h1 className="text-2xl font-bold text-white">Semester Management</h1>
            <p className="text-xs text-gray-400">Create, edit, or publish academic semesters.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Semester</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading semesters...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesters.map((sem) => (
            <div key={sem._id} className="bg-[#141720] border border-white/10 p-5 rounded-2xl space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    SEM {sem.number}
                  </span>
                  <span className="text-xs text-emerald-400 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Published</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{sem.name}</h2>
                <p className="text-xs text-gray-400 line-clamp-2">{sem.description || "No description provided."}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(sem)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(sem._id)}
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
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit Semester" : "Create New Semester"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Semester Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Semester 7"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Semester Number</label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="7"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of course modules..."
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Semester" : "Save Semester"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
