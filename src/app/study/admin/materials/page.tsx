"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Plus, ArrowLeft, Loader2, Edit2, Trash2, Sparkles, AlertCircle, X, FileText } from "lucide-react";

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notebookLmUrl, setNotebookLmUrl] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [type, setType] = useState<string>("notes");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matRes, subRes, chRes] = await Promise.all([
        fetch("/api/study/admin/materials"),
        fetch("/api/study/admin/subjects"),
        fetch("/api/study/admin/chapters"),
      ]);
      const matData = await matRes.json();
      const subData = await subRes.json();
      const chData = await chRes.json();

      setMaterials(matData.materials || []);
      setSubjects(subData.subjects || []);
      setChapters(chData.chapters || []);

      if (subData.subjects?.length > 0 && !subjectId) {
        setSubjectId(subData.subjects[0]._id);
      }
    } catch (err: any) {
      console.error("Fetch materials error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setNotebookLmUrl("");
    setFile(null);
    setErrorMsg(null);
    if (subjects.length > 0) setSubjectId(subjects[0]._id);
    setShowModal(true);
  };

  const openEditModal = (mat: any) => {
    setEditingId(mat._id);
    setTitle(mat.title);
    setDescription(mat.description || "");
    setNotebookLmUrl(mat.notebookLmUrl || "");
    setSubjectId(mat.subjectId?._id || mat.subjectId || "");
    setChapterId(mat.chapterId?._id || mat.chapterId || "");
    setType(mat.type || "notes");
    setFile(null);
    setErrorMsg(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) {
      setErrorMsg("Please fill in title and select a subject.");
      return;
    }
    setSaving(true);
    setErrorMsg(null);

    try {
      const url = editingId ? `/api/study/admin/materials/${editingId}` : "/api/study/admin/materials";
      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("notebookLmUrl", notebookLmUrl);
      formData.append("subjectId", subjectId);
      if (chapterId) formData.append("chapterId", chapterId);
      formData.append("type", type);

      if (file) {
        formData.append("file", file);
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        setErrorMsg(result.error || "Failed to save study material.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study material and PDF file?")) return;
    try {
      const res = await fetch(`/api/study/admin/materials/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete material.");
      }
    } catch (err: any) {
      alert("Error deleting material: " + err.message);
    }
  };

  const filteredChapters = chapters.filter(
    (ch) => (ch.subjectId?._id || ch.subjectId)?.toString() === subjectId?.toString()
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-start space-x-3">
          <Link
            href="/study/admin"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors shrink-0 mt-0.5 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Study Material & PDF Management</h1>
            <p className="text-xs text-slate-600 font-medium">Upload, edit, or delete study materials and question papers.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/20 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Material</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading materials...</div>
      ) : materials.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3 shadow-xs">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Study Materials Uploaded Yet</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            Click &quot;Upload PDF Material&quot; to upload your first note or question paper.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <div key={mat._id} className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl space-y-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {mat.type}
                    </span>
                    {mat.notebookLmUrl && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>NotebookLM</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {mat.downloadCount || 0} downloads
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">{mat.title}</h2>
                <p className="text-xs text-slate-600 font-medium truncate">
                  {mat.subjectId?.name || "Subject"} {mat.chapterId ? `• ${mat.chapterId.name}` : ""}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(mat)}
                  className="p-2 bg-slate-100 hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(mat._id)}
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

      {/* Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">{editingId ? "Edit Study Material" : "Upload New Study Material"}</h2>
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
                <label className="text-slate-700 font-bold block mb-1">Material Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. String Class Complete Notes"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Material Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="notes">Notes</option>
                  <option value="question-paper">Previous Question Paper</option>
                  <option value="important-question">Important Question</option>
                  <option value="reference">Reference Material</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Assign Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                  required
                >
                  {subjects.length === 0 && <option value="">No subjects found</option>}
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} ({sub.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Assign Chapter (Optional)</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="">-- Select Chapter --</option>
                  {filteredChapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      Ch {ch.chapterNumber}: {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-purple-700">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>NotebookLM Page Link (Optional)</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={notebookLmUrl}
                  onChange={(e) => setNotebookLmUrl(e.target.value)}
                  placeholder="https://notebooklm.google.com/notebook/..."
                  className="w-full p-2.5 bg-purple-50/50 border border-purple-200 rounded-xl text-slate-900 placeholder-slate-400 focus:border-purple-600 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of notes..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 h-20 font-medium focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-700 font-bold block mb-1">
                  Upload PDF File {editingId ? "(Optional if keeping existing file)" : "*"}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-medium"
                  required={!editingId}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
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
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Material" : "Upload Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
