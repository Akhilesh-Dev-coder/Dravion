import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import StudyMaterial from "@/models/study/StudyMaterial";
import Question from "@/models/study/Question";
import { ensureSeedData } from "@/lib/study/seed";
import AdSlot from "@/components/study/AdSlot";
import {
  GraduationCap,
  BookOpen,
  Search,
  ArrowRight,
  Sparkles,
  FileText,
  HelpCircle,
  Award,
  Bookmark,
  Download,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export const revalidate = 60; // SSR with ISR every 60s

export default async function StudyLandingPage() {
  await dbConnect();
  await ensureSeedData();

  const [semesters, popularSubjects, recentMaterials, importantQuestions, pyqMaterials] =
    await Promise.all([
      Semester.find({ published: true }).sort({ number: 1 }).lean(),
      Subject.find({ published: true }).populate("semesterId", "number name").limit(6).lean(),
      StudyMaterial.find({ published: true })
        .populate("subjectId", "name code slug")
        .populate("chapterId", "name chapterNumber slug")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Question.find({ isImportant: true, published: true })
        .populate("subjectId", "name code slug")
        .limit(4)
        .lean(),
      StudyMaterial.find({ type: "question-paper", published: true })
        .populate("subjectId", "name code slug")
        .sort({ year: -1 })
        .limit(4)
        .lean(),
    ]);

  return (
    <div className="min-h-screen pb-16 space-y-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#121622] via-[#0d0f12] to-[#0d0f12] pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semester Exam Study Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Dravion <span className="text-blue-500">Study</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-gray-200">
            Study smarter. Prepare better.
          </p>

          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Notes, previous questions, practice materials and study resources for your semester exams.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form action="/study/search" method="GET" className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                name="q"
                placeholder="Search subjects, chapters, notes, questions..."
                className="w-full pl-12 pr-28 py-4 bg-[#181c26] border border-white/15 rounded-2xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 shadow-2xl transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/study/semesters"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Studying</span>
            </Link>
            <Link
              href="/study/semesters"
              className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              <span>Browse Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Monitization Slot */}
        <AdSlot position="study-home" />

        {/* QUICK ACCESS DASHBOARD CARD */}
        <section className="bg-[#141720] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back 👋</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Pick up right where you left off or jump to your study tools.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/study/bookmarks"
                className="flex items-center space-x-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Bookmarks</span>
              </Link>
              <Link
                href="/study/downloads"
                className="flex items-center space-x-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-gray-300 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Downloads</span>
              </Link>
              <Link
                href="/study/progress"
                className="flex items-center space-x-1.5 px-3 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Progress</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Quick Access Card 1 */}
            <div className="bg-[#1a1e2b] border border-white/5 p-5 rounded-xl space-y-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Select Semester</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Organized semester-by-semester subjects, syllabus, and study notes.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
              >
                <span>View Semesters</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Access Card 2 */}
            <div className="bg-[#1a1e2b] border border-white/5 p-5 rounded-xl space-y-3">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg w-fit">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Previous Papers</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Download solved previous year university exam question papers.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-400 hover:text-purple-300 pt-1"
              >
                <span>Explore Papers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Access Card 3 */}
            <div className="bg-[#1a1e2b] border border-white/5 p-5 rounded-xl space-y-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Important MCQs</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Practice chapter-wise multiple choice questions with explanations.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
              >
                <span>Practice MCQs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* BROWSE YOUR SEMESTER */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                <span>Browse Your Semester</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Select your current semester to view all subjects and materials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.map((sem: any) => (
              <Link
                key={sem._id.toString()}
                href={`/study/semester/${sem.slug || sem._id}`}
                className="group relative bg-[#141720] hover:bg-[#181c28] border border-white/10 hover:border-blue-500/40 p-6 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                      SEM {sem.number}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {sem.name}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {sem.description || "All subjects, notes, and question papers."}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span>Explore Subjects</span>
                  <span className="font-semibold text-blue-400">View Materials →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* RECENTLY ADDED MATERIALS */}
        {recentMaterials.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                  <span>Recently Added Materials</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Latest study notes and chapter PDFs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentMaterials.map((mat: any) => (
                <div
                  key={mat._id.toString()}
                  className="bg-[#141720] border border-white/10 p-5 rounded-xl flex items-start justify-between gap-4 hover:border-white/20 transition-all"
                >
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {mat.type}
                    </span>
                    <h3 className="text-sm font-semibold text-white truncate">{mat.title}</h3>
                    <p className="text-xs text-gray-400 truncate">
                      {(mat.subjectId as any)?.name} • {(mat.chapterId as any)?.name}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-gray-500 pt-1">
                      <span>{mat.pageCount || 1} pages</span>
                      <span>•</span>
                      <span>{mat.downloadCount || 0} downloads</span>
                    </div>
                  </div>
                  <Link
                    href={`/study/semester/${(mat.semesterId as any)?.slug || mat.semesterId}/${(mat.subjectId as any)?.slug || mat.subjectId}/${(mat.chapterId as any)?.slug || mat.chapterId}?material=${mat._id}`}
                    className="shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition-all"
                  >
                    Read PDF
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PREVIOUS YEAR QUESTIONS */}
        {pyqMaterials.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <span>Previous Year Questions</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">Official question papers from previous university exams.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pyqMaterials.map((pyq: any) => (
                <div
                  key={pyq._id.toString()}
                  className="bg-[#141720] border border-white/10 p-5 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                        {pyq.year || 2025} Paper
                      </span>
                      <span className="text-xs text-gray-400">{(pyq.subjectId as any)?.name}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-white truncate">{pyq.title}</h3>
                  </div>
                  <Link
                    href={`/study/semester/semester-4/${(pyq.subjectId as any)?.slug || pyq.subjectId}/${(pyq.chapterId as any)?.slug || pyq.chapterId}?material=${pyq._id}`}
                    className="shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    View Paper
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* IMPORTANT TOPICS & QUESTIONS */}
        {importantQuestions.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <HelpCircle className="w-6 h-6 text-emerald-400" />
                <span>Important Exam Questions</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">Frequently asked questions in semester end-exams.</p>
            </div>

            <div className="space-y-3">
              {importantQuestions.map((q: any) => (
                <div
                  key={q._id.toString()}
                  className="p-4 bg-[#141720] border border-white/10 rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ⭐ {q.marks || 5} Marks Question
                    </span>
                    <span className="text-xs text-gray-400">{(q.subjectId as any)?.name}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{q.question}</p>
                  {q.answer && (
                    <p className="text-xs text-gray-400 bg-black/30 p-2.5 rounded border border-white/5 leading-relaxed">
                      <strong className="text-gray-300">Key Point:</strong> {q.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
