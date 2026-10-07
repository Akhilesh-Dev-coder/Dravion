import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import { BookOpen, ChevronRight, Layers, ArrowLeft } from "lucide-react";
import AdSlot from "@/components/study/AdSlot";

export const revalidate = 60;

export default async function SemesterDetailsPage({
  params,
}: {
  params: Promise<{ semesterId: string }>;
}) {
  const { semesterId } = await params;
  await dbConnect();

  let semester = await Semester.findOne({ slug: semesterId, published: true }).lean();
  if (!semester && semesterId.match(/^[0-9a-fA-F]{24}$/)) {
    semester = await Semester.findById(semesterId).lean();
  }

  if (!semester) {
    const num = parseInt(semesterId.replace("semester-", ""));
    if (!isNaN(num)) {
      semester = await Semester.findOne({ number: num, published: true }).lean();
    }
  }

  if (!semester) {
    notFound();
  }

  const subjects = await Subject.find({ semesterId: semester._id, published: true }).lean();

  const subjectsWithChapters = await Promise.all(
    subjects.map(async (sub: any) => {
      const chapters = await Chapter.find({ subjectId: sub._id, published: true })
        .sort({ chapterNumber: 1 })
        .lean();
      return {
        ...sub,
        chapters,
      };
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
        <Link href="/study" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/study/semesters" className="hover:text-blue-600">
          Semesters
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{semester.name}</span>
      </div>

      {/* Semester Header */}
      <div className="border-b border-slate-200 pb-6 space-y-3">
        <div className="flex items-center space-x-3">
          <Link
            href="/study/semesters"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                SEM {semester.number}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900">{semester.name} Subjects</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {semester.description || "Course modules and subject study materials."}
            </p>
          </div>
        </div>
      </div>

      <AdSlot position="subject-page" />

      {/* Subjects Grid */}
      {subjectsWithChapters.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-3 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Subjects Added Yet</h3>
          <p className="text-xs max-w-sm mx-auto font-medium">
            Subjects for this semester will be available soon. Check back shortly!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectsWithChapters.map((sub: any) => (
            <div
              key={sub._id.toString()}
              className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-1 rounded">
                    {sub.code}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{sub.chapters.length} Chapters</span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900">{sub.name}</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {sub.description || "Chapter notes, solved papers, and MCQs."}
                </p>

                {/* Chapter List Preview */}
                {sub.chapters.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Chapters:
                    </span>
                    {sub.chapters.slice(0, 3).map((ch: any) => (
                      <div
                        key={ch._id.toString()}
                        className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium"
                      >
                        <span className="truncate">
                          Ch {ch.chapterNumber}: {ch.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    ))}
                    {sub.chapters.length > 3 && (
                      <p className="text-[11px] text-blue-600 font-bold pl-1">
                        + {sub.chapters.length - 3} more chapters
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/study/semester/${semester.slug || semester._id}/${sub.slug || sub._id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Open {sub.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
