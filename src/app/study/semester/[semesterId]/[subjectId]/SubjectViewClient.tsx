"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PDFViewer from "@/components/study/PDFViewer";
import AdSlot from "@/components/study/AdSlot";
import { BookOpen, FileText, ArrowLeft, HelpCircle, Sparkles, ExternalLink, Clock, Layers } from "lucide-react";

interface SubjectViewClientProps {
  semester: any;
  subject: any;
  modules: any[];
  initialModule: any;
  pyqPapers: any[];
  importantQuestions: any[];
}

export default function SubjectViewClient({
  semester,
  subject,
  modules,
  initialModule,
  pyqPapers,
  importantQuestions,
}: SubjectViewClientProps) {
  const [selectedModule, setSelectedModule] = useState<any>(initialModule || modules[0] || null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [downloadCount, setDownloadCount] = useState<number>(initialModule?.downloadCount || 0);

  // Synchronize guestId and check bookmark/progress
  useEffect(() => {
    if (!selectedModule?._id) return;
    setDownloadCount(selectedModule.downloadCount || 0);

    let guestId = localStorage.getItem("study_guest_id");
    if (!guestId) {
      guestId = `guest_${Math.random().toString(36).substring(2)}`;
      localStorage.setItem("study_guest_id", guestId);
    }

    // Check if current module material is bookmarked
    fetch(`/api/study/bookmarks?guestId=${guestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bookmarks) {
          const found = data.bookmarks.some(
            (b: any) => b.targetId?.toString() === selectedModule._id.toString()
          );
          setIsBookmarked(found);
        }
      })
      .catch(() => {});

    // Send open progress
    fetch("/api/study/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        materialId: selectedModule._id,
        lastPage: 1,
        guestId,
      }),
    }).catch(() => {});
  }, [selectedModule]);

  const handleBookmarkToggle = async () => {
    if (!selectedModule?._id) return;
    const guestId = localStorage.getItem("study_guest_id") || "";
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      await fetch("/api/study/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: selectedModule._id,
          targetType: "material",
          guestId,
        }),
      });
    } catch {
      setIsBookmarked(!nextState);
    }
  };

  const handleDownload = async () => {
    if (!selectedModule?._id) return;
    const guestId = localStorage.getItem("study_guest_id") || "";
    setDownloadCount((prev) => prev + 1);

    try {
      await fetch("/api/study/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          materialId: selectedModule._id,
          guestId,
        }),
      });
    } catch {
      // Ignore
    }
  };

  const handlePageChange = (page: number) => {
    if (!selectedModule?._id) return;
    const guestId = localStorage.getItem("study_guest_id") || "";
    const totalPages = selectedModule.pageCount || 10;
    const completed = page >= totalPages;

    fetch("/api/study/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        materialId: selectedModule._id,
        lastPage: page,
        completed,
        guestId,
      }),
    }).catch(() => {});
  };

  const getFormattedUrl = (url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const notebookUrl = getFormattedUrl(selectedModule?.notebookLmUrl);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6 bg-slate-50 text-slate-900 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 font-medium">
        <Link href="/study" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/study/semester/${semester.slug || semester._id}`} className="hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-none">
          {semester.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-none">{subject.name}</span>
      </div>

      {/* Subject Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-start sm:items-center space-x-3">
          <Link
            href={`/study/semester/${semester.slug || semester._id}`}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition-colors shrink-0 mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded">
                {subject.code}
              </span>
              <span className="text-xs text-slate-500 font-bold">SEM {semester.number}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">{subject.name}</h1>
          </div>
        </div>
        {subject.description && (
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
            {subject.description}
          </p>
        )}
      </div>

      {/* MODULE SELECTOR TABS (1 PDF PER MODULE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Subject Course Modules (1 PDF / Module)</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">{modules.length} Modules</span>
        </div>

        {modules.length > 0 ? (
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x w-full">
            {modules.map((mod: any, idx: number) => {
              const isSelected = selectedModule?._id?.toString() === mod._id?.toString();
              const moduleLabel = mod.chapterNumber ? `Module ${mod.chapterNumber}` : `Module ${idx + 1}`;
              const displayTitle = mod.title || mod.name || moduleLabel;

              return (
                <button
                  key={mod._id.toString()}
                  onClick={() => setSelectedModule(mod)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{moduleLabel}: {displayTitle}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs sm:text-sm font-medium">
            No module PDFs uploaded for this subject yet.
          </div>
        )}
      </div>

      {/* PDF VIEWER FOR SELECTED MODULE */}
      <AdSlot position="pdf-top" />
      {selectedModule?.fileUrl ? (
        <section className="space-y-4 w-full overflow-hidden">
          <PDFViewer
            materialId={selectedModule._id.toString()}
            fileUrl={selectedModule.fileUrl}
            notebookLmUrl={selectedModule.notebookLmUrl}
            title={`${selectedModule.title || selectedModule.name || "Module PDF Note"}`}
            totalPages={selectedModule.pageCount || 10}
            downloadCount={downloadCount}
            isBookmarked={isBookmarked}
            onBookmarkToggle={handleBookmarkToggle}
            onDownload={handleDownload}
            onPageChange={handlePageChange}
          />

          {/* GOOGLE NOTEBOOKLM INTERACTIVE CARD */}
          {notebookUrl && (
            <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-white">
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="p-2.5 sm:p-3.5 bg-white/20 border border-white/30 text-amber-300 rounded-2xl shrink-0 shadow-inner mt-0.5">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
                    Google NotebookLM AI Companion
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold leading-snug">Open Module in Google NotebookLM</h3>
                  <p className="text-xs text-purple-100 leading-relaxed max-w-xl font-medium">
                    Listen to the generated audio overview, ask AI questions, and get instant explanations for this module.
                  </p>
                </div>
              </div>

              <a
                href={notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 bg-white text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-extrabold px-5 py-3 rounded-xl transition-all shadow-lg cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Launch NotebookLM</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </section>
      ) : null}

      <AdSlot position="pdf-bottom" />

      {/* PREVIOUS YEAR PAPERS */}
      {pyqPapers.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>Previous Year Question Papers</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pyqPapers.map((paper: any) => (
              <div
                key={paper._id.toString()}
                className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                    {paper.year || 2025} University Exam
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{paper.title}</h4>
                </div>
                <a
                  href={`/api/study/pdf-proxy?url=${encodeURIComponent(paper.fileUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Read Paper
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IMPORTANT EXAM QUESTIONS */}
      {importantQuestions.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Important Exam Questions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {importantQuestions.map((q: any) => (
              <div
                key={q._id.toString()}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    ⭐ {q.marks || 5} Marks Question ({q.year || "Frequent"})
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                {q.answer && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-normal">
                    <strong className="text-blue-600 font-bold">Answer Key:</strong> {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <AdSlot position="mobile-banner" />
    </div>
  );
}
