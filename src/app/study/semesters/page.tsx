import React from "react";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import { ensureSeedData } from "@/lib/study/seed";
import { BookOpen, ChevronRight, Layers } from "lucide-react";
import AdSlot from "@/components/study/AdSlot";

export const revalidate = 60;

export default async function SemestersPage() {
  await dbConnect();
  await ensureSeedData();

  const semesters = await Semester.find({ published: true }).sort({ number: 1 }).lean();
  const subjects = await Subject.find({ published: true }).lean();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Academic Curriculum</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">All Semesters</h1>
        <p className="text-sm text-gray-400">Select your semester to browse subjects and study materials.</p>
      </div>

      <AdSlot position="subject-page" />

      {/* Semesters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesters.map((sem: any) => {
          const semSubjects = subjects.filter(
            (s: any) => s.semesterId.toString() === sem._id.toString()
          );

          return (
            <div
              key={sem._id.toString()}
              className="bg-[#141720] border border-white/10 hover:border-blue-500/40 rounded-2xl p-6 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    SEMESTER {sem.number}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{semSubjects.length} Subjects</span>
                </div>

                <h2 className="text-2xl font-bold text-white">{sem.name}</h2>

                <p className="text-xs text-gray-400 leading-relaxed min-h-[40px]">
                  {sem.description || "Comprehensive course notes, revision papers, and question banks."}
                </p>

                {/* Subject Preview Pills */}
                {semSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {semSubjects.map((sub: any) => (
                      <span
                        key={sub._id.toString()}
                        className="text-[11px] px-2.5 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-lg"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/study/semester/${sem.slug || sem._id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Semester {sem.number}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
