"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Plus, ArrowLeft, Loader2, Edit2, Trash2, AlertCircle, X } from "lucide-react";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      if (semData.semesters?.length > 0 && !semesterId) {
        setSemesterId(semData.semesters[0]._id);
      }
    } catch (err: any) {
      console.error("Fetch subjects error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setCode("");
    setDescription("");
    setErrorMsg(null);
    if (semesters.length > 0) setSemesterId(semesters[0]._id);
    setShowModal(true);
  };

  const openEditModal = (sub: any) => {
    setEditingId(sub._id);
    setName(sub.name);
    setCode(sub.code);
    setSemesterId(sub.semesterId?._id || sub.semesterId);
    setDescription(sub.description || "");
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !semesterId) {
      setErrorMsg("Subject name, code, and assigned semester are required.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/study/admin/subjects/${editingId}` : "/api/study/admin/subjects";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, semesterId, description }),
      });

      const result = await res.json();

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        setErrorMsg(result.error || "Failed to save subject.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      const res = await fetch(`/api/study/admin/subjects/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete subject.");
      }
    } catch (err: any) {
      alert("Error deleting subject: " + err.message);
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
            <h1 className="text-2xl font-extrabold text-slate-900">Subject Management</h1>
            <p className="text-xs text-slate-600 font-medium">Add and edit subjects assigned to academic semesters.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Subjects Created Yet</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            Click &quot;Add Subject&quot; to assign your first course subject to a semester.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
            <div key={sub._id} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{sub.semesterId?.name}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{sub.name}</h2>
                <p className="text-xs text-slate-600 font-medium line-clamp-2">{sub.description || "No description."}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(sub)}
                  className="p-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
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
              <h2 className="text-lg font-extrabold text-slate-900">{editingId ? "Edit Subject" : "Add New Subject"}</h2>
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
                <label className="text-slate-700 font-bold block mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Subject Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CS601"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600 uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Assign Semester *</label>
                <select
                  value={semesterId}
                  onChange={(e) => setSemesterId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                >
                  {semesters.length === 0 && <option value="">No semesters found</option>}
                  {semesters.map((sem) => (
                    <option key={sem._id} value={sem._id}>
                      {sem.name} (Sem {sem.number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course description..."
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
