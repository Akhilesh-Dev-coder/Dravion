import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import Question from "@/models/study/Question";
import StudyMaterial from "@/models/study/StudyMaterial";
import MCQ from "@/models/study/MCQ";
import { BookOpen, FileText, ChevronRight, HelpCircle, Award, ArrowLeft, Clock } from "lucide-react";
import AdSlot from "@/components/study/AdSlot";

export const revalidate = 60;

export default async function SubjectDetailsPage({
  params,
}: {
  params: Promise<{ semesterId: string; subjectId: string }>;
}) {
  const { semesterId, subjectId } = await params;
  await dbConnect();

  let semester = await Semester.findOne({ slug: semesterId, published: true }).lean();
  if (!semester && semesterId.match(/^[0-9a-fA-F]{24}$/)) {
    semester = await Semester.findById(semesterId).lean();
  }
  if (!semester) {
    const num = parseInt(semesterId.replace("semester-", ""));
    if (!isNaN(num)) semester = await Semester.findOne({ number: num }).lean();
  }

  if (!semester) notFound();

  let subject = await Subject.findOne({
    semesterId: semester._id,
    slug: subjectId,
    published: true,
  }).lean();

  if (!subject && subjectId.match(/^[0-9a-fA-F]{24}$/)) {
    subject = await Subject.findById(subjectId).lean();
  }

  if (!subject) notFound();

  const [chapters, importantQuestions, pyqPapers, mcqs] = await Promise.all([
    Chapter.find({ subjectId: subject._id, published: true }).sort({ chapterNumber: 1 }).lean(),
    Question.find({ subjectId: subject._id, published: true }).lean(),
    StudyMaterial.find({ subjectId: subject._id, type: "question-paper", published: true })
      .sort({ year: -1 })
      .lean(),
    MCQ.find({ subjectId: subject._id, published: true }).lean(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10 bg-slate-50 text-slate-900 min-h-screen">
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

      {/* Subject Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-sm space-y-4">
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
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">{subject.name}</h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-medium">
          {subject.description || "Course study materials, chapter notes, and exam questions."}
        </p>

        {/* Quick Info Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 text-[11px] sm:text-xs text-slate-500 border-t border-slate-100 font-medium">
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-slate-900 font-bold">{chapters.length}</strong> Chapters
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-slate-900 font-bold">{pyqPapers.length}</strong> Previous Papers
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-slate-900 font-bold">{importantQuestions.length}</strong> Important Questions
          </span>
        </div>
      </div>

      <AdSlot position="subject-page" />

      {/* CHAPTERS SECTION */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span>Chapter Modules</span>
          </h2>
          <span className="text-xs text-slate-500 font-bold">{chapters.length} chapters available</span>
        </div>

        {chapters.length === 0 ? (
          <div className="p-6 sm:p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs sm:text-sm font-medium">
            No chapters uploaded for this subject yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {chapters.map((ch: any) => (
              <Link
                key={ch._id.toString()}
                href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}/${ch.slug || ch._id}`}
                className="group bg-white hover:border-blue-500 border border-slate-200 p-4 sm:p-5 rounded-xl transition-all shadow-xs hover:shadow-md flex items-start justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                      CH {ch.chapterNumber}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-medium">
                    {ch.description || "PDF notes, key formulas, and exam questions."}
                  </p>
                </div>
                <div className="p-1.5 sm:p-2 bg-slate-100 group-hover:bg-blue-600 text-slate-500 group-hover:text-white rounded-lg transition-colors shrink-0 my-auto">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* PREVIOUS YEAR PAPERS */}
      {pyqPapers.length > 0 && (
        <section className="space-y-4 sm:space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
              <span>Previous Year Question Papers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pyqPapers.map((paper: any) => (
              <div
                key={paper._id.toString()}
                className="bg-white border border-slate-200 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                    {paper.year || 2025} University Exam
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{paper.title}</h3>
                </div>
                <Link
                  href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}/${chapters[0]?.slug || "notes"}?material=${paper._id}`}
                  className="w-full sm:w-auto text-center shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20"
                >
                  Read Paper
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IMPORTANT QUESTIONS SECTION */}
      {importantQuestions.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
              <span>Important Exam Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {importantQuestions.map((q: any) => (
              <div
                key={q._id.toString()}
                className="p-5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
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
    </div>
  );
}
