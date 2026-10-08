"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, FileText, ArrowRight, Loader2, Check } from "lucide-react";

export default function DownloadsPage() {
  const [userDownloads, setUserDownloads] = useState<any[]>([]);
  const [popularMaterials, setPopularMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [completedId, setCompletedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      let guestId = localStorage.getItem("study_guest_id");
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem("study_guest_id", guestId);
      }

      const res = await fetch(`/api/study/downloads?guestId=${guestId}`);
      const data = await res.json();
      setUserDownloads(data.userDownloads || []);
      setPopularMaterials(data.popularMaterials || []);
    } catch {
      // Ignore fetch error
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mat: any) => {
    const matId = mat._id?.toString();
    if (downloadingId === matId) return;

    try {
      setDownloadingId(matId);
      const proxyUrl = `/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanTitle = (mat.title || "Study_Note").replace(/[^a-zA-Z0-9_\-]/g, "_");
      link.download = `${cleanTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadingId(null);
      setCompletedId(matId);
      setToastMessage(`"${mat.title}" has been saved to your downloads.`);

      setTimeout(() => setCompletedId(null), 3000);
      setTimeout(() => setToastMessage(null), 4500);
    } catch {
      const proxyUrl = `/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`;
      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = `${mat.title || "Note"}.pdf`;
      link.target = "_blank";
      link.click();

      setDownloadingId(null);
      setCompletedId(matId);
      setToastMessage(`"${mat.title}" download started.`);
      setTimeout(() => {
        setCompletedId(null);
        setToastMessage(null);
      }, 3000);
    }
  };

  const displayMaterials = userDownloads.length > 0 ? userDownloads : popularMaterials;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen relative">
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold">
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Offline Study Vault</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Downloaded Materials</h1>
        <p className="text-sm text-slate-600 font-medium">Quick access to all notes, question papers, and study resources you have downloaded.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading downloaded materials...</div>
      ) : displayMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3 shadow-sm">
          <Download className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Downloads Tracked Yet</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            When you click download on any note or PDF material, it will automatically appear here for offline access.
          </p>
          <Link
            href="/study/semesters"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
          >
            <span>Browse Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>{userDownloads.length > 0 ? "Your Download History" : "Popular Downloads"}</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">{displayMaterials.length} Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayMaterials.map((mat: any, idx: number) => {
              const matId = mat._id?.toString();
              const isDownloading = downloadingId === matId;
              const isCompleted = completedId === matId;

              const semSlug = mat.semesterId?.slug || `semester-${mat.semesterId?.number || 1}`;
              const subSlug = mat.subjectId?.slug || mat.subjectId?._id || mat.subjectId;
              const chSlug = mat.chapterId?.slug || mat.chapterId?._id || mat.chapterId;
              const viewLink = semSlug && subSlug && chSlug
                ? `/study/semester/${semSlug}/${subSlug}/${chSlug}?material=${mat._id}`
                : `/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`;

              return (
                <div
                  key={`${mat._id}-${idx}`}
                  className="bg-white border border-slate-200 hover:border-blue-300 p-5 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {mat.type || "Notes"}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {mat.downloadCount || 1} downloads
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 truncate">{mat.title}</h3>
                    <p className="text-xs text-slate-500 truncate font-medium">
                      {mat.subjectId?.name || "Subject Note"} • {mat.chapterId?.name || "Chapter Material"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <Link
                      href={viewLink}
                      className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold rounded-xl transition-all shadow-xs"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDownload(mat)}
                      disabled={isDownloading}
                      className={`flex items-center space-x-1.5 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer ${
                        isDownloading
                          ? "bg-emerald-500 opacity-90 cursor-not-allowed shadow-none"
                          : isCompleted
                          ? "bg-emerald-700 text-white shadow-emerald-600/20"
                          : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FLOATING SUCCESS TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 bg-slate-900/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="p-1.5 bg-emerald-500 rounded-full text-slate-950 shrink-0">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div className="text-left pr-2">
            <p className="text-xs font-bold text-white">Download Started!</p>
            <p className="text-[11px] text-slate-300 font-medium max-w-xs truncate">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
