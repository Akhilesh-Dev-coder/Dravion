"use client";

import React, { useState } from "react";
import Link from "next/link";
import PDFViewer from "@/components/study/PDFViewer";
import MCQQuiz from "@/components/study/MCQQuiz";
import AdSlot from "@/components/study/AdSlot";
import { BookOpen, FileText, ArrowLeft, HelpCircle, Sparkles, ExternalLink } from "lucide-react";

interface ChapterViewClientProps {
  semester: any;
  subject: any;
  chapter: any;
  materials: any[];
  initialMaterial: any;
  formattedMCQs?: any[];
  questions: any[];
}

export default function ChapterViewClient({
  semester,
  subject,
  chapter,
  materials: initialMaterials,
  initialMaterial,
  questions,
}: ChapterViewClientProps) {
  const [materials] = useState<any[]>(initialMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(initialMaterial);

  const getFormattedUrl = (url?: string) => {
    if (!url) return "";
    const trimmed = url.trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const notebookUrl = getFormattedUrl(selectedMaterial?.notebookLmUrl);

  return (
    <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
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
        <Link
          href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}`}
          className="hover:text-blue-600 transition-colors truncate max-w-[120px] sm:max-w-none"
        >
          {subject.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-none">{chapter?.name || "Study Resources"}</span>
      </div>

      {/* Chapter Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-start sm:items-center space-x-3">
          <Link
            href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}`}
            className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition-colors shrink-0 mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              {chapter && (
                <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md">
                  Ch {chapter.chapterNumber}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium truncate">{subject.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
              {chapter?.name || "Chapter Notes & Resources"}
            </h1>
          </div>
        </div>
      </div>

      {/* Available Material Tabs */}
      {materials.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x w-full">
          {materials.map((mat: any) => {
            const isSelected = selectedMaterial?._id?.toString() === mat._id?.toString();
            return (
              <button
                key={mat._id.toString()}
                onClick={() => setSelectedMaterial(mat)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate max-w-[160px] sm:max-w-[200px]">{mat.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* PDF VIEWER SECTION */}
      <AdSlot position="pdf-top" />
      {selectedMaterial ? (
        <section className="space-y-4 w-full overflow-hidden">
          <PDFViewer
            materialId={selectedMaterial._id.toString()}
            fileUrl={selectedMaterial.fileUrl}
            notebookLmUrl={selectedMaterial.notebookLmUrl}
            title={selectedMaterial.title}
            totalPages={selectedMaterial.pageCount || 10}
            downloadCount={selectedMaterial.downloadCount || 0}
          />

          {/* NOTEBOOKLM INTERACTIVE AI CARD */}
          {notebookUrl && (
            <div className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-white">
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="p-2.5 sm:p-3.5 bg-white/20 border border-white/30 text-amber-300 rounded-2xl shrink-0 shadow-inner mt-0.5">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
                      NotebookLM Interactive Setup
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold leading-snug">Open Full Module in Google NotebookLM</h3>
                  <p className="text-xs text-purple-100 leading-relaxed max-w-xl font-medium">
                    Access the interactive audio overview, AI explanations, and smart study setup created specifically for this module section.
                  </p>
                </div>
              </div>

              <a
                href={notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 bg-white text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-extrabold px-5 py-3.5 rounded-xl transition-all shadow-lg cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Launch NotebookLM</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </section>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 shadow-sm">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-xs sm:text-sm font-medium">No PDF document attached to this chapter yet.</p>
        </div>
      )}

      <AdSlot position="pdf-bottom" />

      {/* CHAPTER IMPORTANT QUESTIONS */}
      {questions.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Chapter Exam Questions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {questions.map((q: any) => (
              <div
                key={q._id.toString()}
                className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    ⭐ {q.marks || 5} Marks Question
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{q.question}</h4>
                {q.answer && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed font-normal">
                    <strong className="text-blue-600 font-bold">Answer:</strong> {q.answer}
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
