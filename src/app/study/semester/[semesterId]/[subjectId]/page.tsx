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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
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
        <span className="text-white font-semibold truncate max-w-[140px] sm:max-w-none">{subject.name}</span>
      </div>

      {/* Subject Header */}
      <div className="bg-[#141720] border border-white/10 rounded-2xl p-4 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-start sm:items-center space-x-3">
          <Link
            href={`/study/semester/${semester.slug || semester._id}`}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors shrink-0 mt-0.5 sm:mt-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="space-y-0.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                {subject.code}
              </span>
              <span className="text-xs text-gray-400">SEM {semester.number}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">{subject.name}</h1>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-300 max-w-3xl leading-relaxed">
          {subject.description || "Course study materials, chapter notes, and exam questions."}
        </p>

        {/* Quick Info Stats */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 text-[11px] sm:text-xs text-gray-400 border-t border-white/5">
          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-white">{chapters.length}</strong> Chapters
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-white">{pyqPapers.length}</strong> Previous Papers
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="bg-white/5 border border-white/10 px-2 py-1 rounded-md sm:border-none sm:p-0 sm:bg-transparent">
            <strong className="text-white">{importantQuestions.length}</strong> Important Questions
          </span>
        </div>
      </div>

      <AdSlot position="subject-page" />

      {/* CHAPTERS SECTION */}
      <section className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span>Chapter Modules</span>
          </h2>
          <span className="text-xs text-gray-400">{chapters.length} chapters available</span>
        </div>

        {chapters.length === 0 ? (
          <div className="p-6 sm:p-8 text-center bg-[#141720] border border-white/10 rounded-xl text-gray-400 text-xs sm:text-sm">
            No chapters uploaded for this subject yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {chapters.map((ch: any) => (
              <Link
                key={ch._id.toString()}
                href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}/${ch.slug || ch._id}`}
                className="group bg-[#141720] hover:bg-[#181c28] border border-white/10 hover:border-blue-500/40 p-4 sm:p-5 rounded-xl transition-all shadow-md flex items-start justify-between gap-3 sm:gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      CH {ch.chapterNumber}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                    {ch.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {ch.description || "PDF notes, key formulas, and exam questions."}
                  </p>
                </div>
                <div className="p-1.5 sm:p-2 bg-white/5 group-hover:bg-blue-600 text-gray-400 group-hover:text-white rounded-lg transition-colors shrink-0 my-auto">
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
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <span>Previous Year Question Papers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {pyqPapers.map((paper: any) => (
              <div
                key={paper._id.toString()}
                className="bg-[#141720] border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded inline-block">
                    {paper.year || 2025} University Exam
                  </span>
                  <h3 className="text-xs sm:text-sm font-semibold text-white truncate">{paper.title}</h3>
                </div>
                <Link
                  href={`/study/semester/${semester.slug || semester._id}/${subject.slug || subject._id}/${chapters[0]?.slug || "notes"}?material=${paper._id}`}
                  className="w-full sm:w-auto text-center shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow"
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
          <div className="border-b border-white/10 pb-4">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
              <span>Important Exam Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {importantQuestions.map((q: any) => (
              <div
                key={q._id.toString()}
                className="p-5 bg-[#141720] border border-white/10 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                    ⭐ {q.marks || 5} Marks Question ({q.year || "Frequent"})
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{q.question}</h4>
                {q.answer && (
                  <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-lg border border-white/5 leading-relaxed">
                    <strong className="text-blue-400">Answer Key:</strong> {q.answer}
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
