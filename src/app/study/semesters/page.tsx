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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          <span>Academic Curriculum</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">All Semesters</h1>
        <p className="text-sm text-slate-600 font-medium">Select your semester to browse subjects and study materials.</p>
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
              className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    SEMESTER {sem.number}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">{semSubjects.length} Subjects</span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900">{sem.name}</h2>

                <p className="text-xs text-slate-600 leading-relaxed font-medium min-h-[40px]">
                  {sem.description || "Comprehensive course notes, revision papers, and question banks."}
                </p>

                {/* Subject Preview Pills */}
                {semSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {semSubjects.map((sub: any) => (
                      <span
                        key={sub._id.toString()}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-medium"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/study/semester/${sem.slug || sem._id}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
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
