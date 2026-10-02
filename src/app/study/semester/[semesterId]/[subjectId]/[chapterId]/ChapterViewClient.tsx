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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-gray-400">
        <Link href="/study" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/study/semester/${semester.slug || semester._id}`} className="hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none">
          {semester.name}
        </Link>
        <span>/</span>
        <Link
          href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}`}
          className="hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none"
        >
          {subject.name}
        </Link>
        <span>/</span>
        <span className="text-white font-semibold truncate max-w-[140px] sm:max-w-none">{chapter?.name || "Study Resources"}</span>
      </div>

      {/* Chapter Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-start sm:items-center space-x-3">
          <Link
            href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}`}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors shrink-0 mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              {chapter && (
                <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                  Ch {chapter.chapterNumber}
                </span>
              )}
              <span className="text-xs text-gray-400 truncate">{subject.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-snug">
              {chapter?.name || "Chapter Notes & Resources"}
            </h1>
          </div>
        </div>
      </div>

      {/* Available Material Tabs */}
      {materials.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x w-full">
          {materials.map((mat: any) => {
            const isSelected = selectedMaterial?._id?.toString() === mat._id?.toString();
            return (
              <button
                key={mat._id.toString()}
                onClick={() => setSelectedMaterial(mat)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
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
            <div className="w-full bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all hover:border-purple-400/50">
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="p-2.5 sm:p-3.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-2xl shrink-0 shadow-inner mt-0.5">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-300 animate-pulse" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      NotebookLM Interactive Setup
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">Open Full Module in Google NotebookLM</h3>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                    Access the interactive audio overview, AI explanations, and smart study setup created specifically for this module section.
                  </p>
                </div>
              </div>

              <a
                href={notebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold px-5 py-3.5 rounded-xl transition-all shadow-lg shadow-purple-600/30 cursor-pointer border border-purple-400/30 transform hover:-translate-y-0.5"
              >
                <span>Launch NotebookLM</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </section>
      ) : (
        <div className="p-8 sm:p-12 text-center bg-[#141720] border border-white/10 rounded-2xl text-gray-400">
          <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-2" />
          <p className="text-xs sm:text-sm">No PDF document attached to this chapter yet.</p>
        </div>
      )}

      <AdSlot position="pdf-bottom" />

      {/* CHAPTER IMPORTANT QUESTIONS */}
      {questions.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              <span>Chapter Exam Questions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {questions.map((q: any) => (
              <div
                key={q._id.toString()}
                className="p-4 bg-[#141720] border border-white/10 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    ⭐ {q.marks || 5} Marks Question
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white">{q.question}</h4>
                {q.answer && (
                  <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                    <strong className="text-blue-400">Answer:</strong> {q.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
