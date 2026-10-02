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
    // Try matching number
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        <Link href="/study" className="hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link href="/study/semesters" className="hover:text-white">
          Semesters
        </Link>
        <span>/</span>
        <span className="text-white font-semibold">{semester.name}</span>
      </div>

      {/* Semester Header */}
      <div className="border-b border-white/10 pb-6 space-y-3">
        <div className="flex items-center space-x-3">
          <Link
            href="/study/semesters"
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                SEM {semester.number}
              </span>
              <h1 className="text-3xl font-extrabold text-white">{semester.name} Subjects</h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {semester.description || "Course modules and subject study materials."}
            </p>
          </div>
        </div>
      </div>

      <AdSlot position="subject-page" />

      {/* Subjects Grid */}
      {subjectsWithChapters.length === 0 ? (
        <div className="p-12 text-center bg-[#141720] border border-white/10 rounded-2xl text-gray-400 space-y-3">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Subjects Added Yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Subjects for this semester will be available soon. Check back shortly!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjectsWithChapters.map((sub: any) => (
            <div
              key={sub._id.toString()}
              className="bg-[#141720] border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition-all shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded">
                    {sub.code}
                  </span>
                  <span className="text-xs text-gray-400">{sub.chapters.length} Chapters</span>
                </div>

                <h2 className="text-xl font-bold text-white">{sub.name}</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {sub.description || "Chapter notes, solved papers, and MCQs."}
                </p>

                {/* Chapter List Preview */}
                {sub.chapters.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Chapters:
                    </span>
                    {sub.chapters.slice(0, 3).map((ch: any) => (
                      <div
                        key={ch._id.toString()}
                        className="flex items-center justify-between text-xs text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                      >
                        <span className="truncate">
                          Ch {ch.chapterNumber}: {ch.name}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      </div>
                    ))}
                    {sub.chapters.length > 3 && (
                      <p className="text-[11px] text-blue-400 pl-1">
                        + {sub.chapters.length - 3} more chapters
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <Link
                  href={`/study/semester/${semester.slug || semester._id}/${sub.slug || sub._id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
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
