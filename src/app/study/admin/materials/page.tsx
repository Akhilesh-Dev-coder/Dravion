"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, Plus, ArrowLeft, Loader2, Edit2, Trash2, Sparkles, ExternalLink } from "lucide-react";

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

      if (subData.subjects?.length > 0) setSubjectId(subData.subjects[0]._id);
      if (chData.chapters?.length > 0) setChapterId(chData.chapters[0]._id);
    } catch {
      // Ignore
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
    setShowModal(true);
  };

  const openEditModal = (mat: any) => {
    setEditingId(mat._id);
    setTitle(mat.title);
    setDescription(mat.description || "");
    setNotebookLmUrl(mat.notebookLmUrl || "");
    setSubjectId(mat.subjectId?._id || mat.subjectId);
    setChapterId(mat.chapterId?._id || mat.chapterId || "");
    setType(mat.type || "notes");
    setFile(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subjectId) return;
    setSaving(true);
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
    if (!confirm("Are you sure you want to delete this study material and PDF file?")) return;
    try {
      const res = await fetch(`/api/study/admin/materials/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-start space-x-3">
          <Link
            href="/study/admin"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors shrink-0 mt-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Study Material & PDF Management</h1>
            <p className="text-xs text-gray-400">Upload, edit, or delete study materials and question papers.</p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/20 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Material</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading materials...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((mat) => (
            <div key={mat._id} className="bg-[#141720] border border-white/10 p-4 sm:p-5 rounded-xl sm:rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {mat.type}
                    </span>
                    {mat.notebookLmUrl && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>NotebookLM</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {mat.downloadCount || 0} downloads • {mat.viewCount || 0} views
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white truncate">{mat.title}</h2>
                <p className="text-xs text-gray-400 truncate">
                  {mat.subjectId?.name} {mat.chapterId ? `• ${mat.chapterId.name}` : ""}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2">
                <button
                  onClick={() => openEditModal(mat)}
                  className="p-2 bg-white/5 hover:bg-blue-600/20 border border-white/10 text-gray-300 hover:text-blue-400 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(mat._id)}
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
            <h2 className="text-lg font-bold text-white">{editingId ? "Edit Study Material" : "Upload New Study Material"}</h2>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 block mb-1">Material Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. String Class Complete Notes"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Material Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                >
                  <option value="notes">Notes</option>
                  <option value="question-paper">Previous Question Paper</option>
                  <option value="important-question">Important Question</option>
                  <option value="reference">Reference Material</option>
                </select>
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
                <label className="text-gray-300 block mb-1">Assign Chapter (Optional)</label>
                <select
                  value={chapterId}
                  onChange={(e) => setChapterId(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white"
                >
                  <option value="">-- Select Chapter --</option>
                  {chapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-semibold mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>NotebookLM Page Link (Optional)</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={notebookLmUrl}
                  onChange={(e) => setNotebookLmUrl(e.target.value)}
                  placeholder="https://notebooklm.google.com/notebook/..."
                  className="w-full p-2.5 bg-purple-950/20 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-400 focus:outline-none"
                />
                <p className="text-[10px] text-purple-300/80 mt-1">
                  Paste NotebookLM share link for full study setup & AI audio overview.
                </p>
                <div className="mt-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] text-amber-300/90 leading-normal">
                  💡 <strong>NotebookLM Access Tip:</strong> Open your notebook in Google NotebookLM, click <strong>Share ↗</strong> in top-right corner, and change access to <strong>&quot;Anyone with the link can view&quot;</strong>. If left as Restricted, students will see <em>&quot;Notebook not found&quot;</em>.
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of notes..."
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-lg text-white h-20"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">
                  Upload PDF File {editingId ? "(Optional if keeping existing file)" : ""}
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full p-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs"
                  required={!editingId}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
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
