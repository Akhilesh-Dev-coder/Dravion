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
    <div className="min-h-screen pb-16 space-y-10 bg-slate-50 text-slate-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-400/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Semester Exam Study Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dravion <span className="text-blue-600">Study</span>
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-slate-700">
            Study smarter. Prepare better.
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Notes, previous questions, practice materials and study resources for your semester exams.
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-2xl mx-auto">
            <form action="/study/search" method="GET" className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                name="q"
                placeholder="Search subjects, chapters, notes, questions..."
                className="w-full pl-12 pr-28 py-4 bg-white border border-slate-300 rounded-2xl text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-md transition-all font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/study/semesters"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Studying</span>
            </Link>
            <Link
              href="/study/semesters"
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>Browse Subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Monitization Slot */}
        <AdSlot position="study-home" />

        {/* QUICK ACCESS DASHBOARD CARD */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Welcome back 👋</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Pick up right where you left off or jump to your study tools.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/study/bookmarks"
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                <span>Bookmarks</span>
              </Link>
              <Link
                href="/study/downloads"
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Downloads</span>
              </Link>
              <Link
                href="/study/progress"
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track Progress</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {/* Quick Access Card 1 */}
            <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl space-y-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl w-fit shadow-md shadow-blue-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Select Semester</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Organized semester-by-semester subjects, syllabus, and study notes.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 pt-1"
              >
                <span>View Semesters</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Access Card 2 */}
            <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-xl space-y-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl w-fit shadow-md shadow-purple-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Previous Papers</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Download solved previous year university exam question papers.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-extrabold text-purple-600 hover:text-purple-700 pt-1"
              >
                <span>Explore Papers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Access Card 3 */}
            <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-xl space-y-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl w-fit shadow-md shadow-emerald-500/20">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Important MCQs</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Practice chapter-wise multiple choice questions with explanations.
              </p>
              <Link
                href="/study/semesters"
                className="inline-flex items-center space-x-1 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 pt-1"
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
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span>Browse Your Semester</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium">Select your current semester to view all subjects and materials.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {semesters.map((sem: any) => (
              <Link
                key={sem._id.toString()}
                href={`/study/semester/${sem.slug || sem._id}`}
                className="group relative bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                      SEM {sem.number}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {sem.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">
                    {sem.description || "All subjects, notes, and question papers."}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Explore Subjects</span>
                  <span className="font-extrabold text-blue-600">View Materials →</span>
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
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <span>Recently Added Materials</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium">Latest study notes and chapter PDFs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentMaterials.map((mat: any) => (
                <div
                  key={mat._id.toString()}
                  className="bg-white border border-slate-200 p-5 rounded-xl flex items-start justify-between gap-4 hover:border-slate-300 transition-all shadow-xs"
                >
                  <div className="space-y-1.5 min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                      {mat.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 truncate">{mat.title}</h3>
                    <p className="text-xs text-slate-600 truncate font-medium">
                      {(mat.subjectId as any)?.name} • {(mat.chapterId as any)?.name}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium pt-1">
                      <span>{mat.pageCount || 1} pages</span>
                      <span>•</span>
                      <span>{mat.downloadCount || 0} downloads</span>
                    </div>
                  </div>
                  <Link
                    href={`/study/semester/${(mat.semesterId as any)?.slug || mat.semesterId}/${(mat.subjectId as any)?.slug || mat.subjectId}/${(mat.chapterId as any)?.slug || mat.chapterId}?material=${mat._id}`}
                    className="shrink-0 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
                  >
                    Read PDF
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
