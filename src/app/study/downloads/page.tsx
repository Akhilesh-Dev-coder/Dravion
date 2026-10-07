"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Download, FileText, ArrowRight, Sparkles } from "lucide-react";

export default function DownloadsPage() {
  const [userDownloads, setUserDownloads] = useState<any[]>([]);
  const [popularMaterials, setPopularMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const displayMaterials = userDownloads.length > 0 ? userDownloads : popularMaterials;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
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
                    <a
                      href={`/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
