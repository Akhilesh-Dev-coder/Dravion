"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, ArrowLeft, Loader2, Check, Edit2, Trash2, AlertCircle, X } from "lucide-react";

export default function AdminSemestersPage() {
  const [semesters, setSemesters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/study/admin/semesters");
      const data = await res.json();
      setSemesters(data.semesters || []);
    } catch (err: any) {
      console.error("Fetch semesters error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setNumber("");
    setDescription("");
    setErrorMsg(null);
    setShowModal(true);
  };

  const openEditModal = (sem: any) => {
    setEditingId(sem._id);
    setName(sem.name);
    setNumber(sem.number.toString());
    setDescription(sem.description || "");
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !number) {
      setErrorMsg("Semester name and number are required.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/study/admin/semesters/${editingId}` : "/api/study/admin/semesters";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, number: parseInt(number), description }),
      });

      const result = await res.json();

      if (res.ok) {
        setShowModal(false);
        fetchSemesters();
      } else {
        setErrorMsg(result.error || "Failed to save semester.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this semester?")) return;
    try {
      const res = await fetch(`/api/study/admin/semesters/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchSemesters();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete semester.");
      }
    } catch (err: any) {
      alert("Error deleting semester: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/study/admin"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Semester Management</h1>
            <p className="text-xs text-slate-600 font-medium">Create, edit, or publish academic semesters.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Semester</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading semesters...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesters.map((sem) => (
            <div key={sem._id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    SEM {sem.number}
                  </span>
                  <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Published</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{sem.name}</h2>
                <p className="text-xs text-slate-600 font-medium line-clamp-2">{sem.description || "No description provided."}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(sem)}
                  className="p-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(sem._id)}
                  className="p-2 bg-slate-100 hover:bg-rose-50 border border-slate-200 text-slate-700 hover:text-rose-600 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">{editingId ? "Edit Semester" : "Create New Semester"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 font-bold block mb-1">Semester Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Semester 7"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Semester Number *</label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="7"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of course modules..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 h-20 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow-md shadow-blue-500/20"
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
