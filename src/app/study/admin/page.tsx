import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import StudyMaterial from "@/models/study/StudyMaterial";
import Question from "@/models/study/Question";
import MCQ from "@/models/study/MCQ";
import {
  Shield,
  Layers,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Upload,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login?callbackUrl=/study/admin");
  }

  await dbConnect();

  const [semCount, subCount, chCount, matCount, qCount, mcqCount] = await Promise.all([
    Semester.countDocuments(),
    Subject.countDocuments(),
    Chapter.countDocuments(),
    StudyMaterial.countDocuments(),
    Question.countDocuments(),
    MCQ.countDocuments(),
  ]);

  const adminLinks = [
    { title: "Semesters", count: semCount, href: "/study/admin/semesters", icon: Layers, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Subjects", count: subCount, href: "/study/admin/subjects", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Chapters", count: chCount, href: "/study/admin/chapters", icon: Layers, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: "Study Materials (PDFs)", count: matCount, href: "/study/admin/materials", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Exam Questions", count: qCount, href: "/study/admin/questions", icon: HelpCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Practice MCQs", count: mcqCount, href: "/study/admin/mcqs", icon: Award, color: "text-rose-400", bg: "bg-rose-500/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-2">Study Content Management</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage semesters, course subjects, chapters, PDF note uploads, and MCQs.
          </p>
        </div>

        <Link
          href="/study/admin/materials"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload PDF Material</span>
        </Link>
      </div>

      {/* Grid Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="bg-[#141720] hover:bg-[#181c28] border border-white/10 hover:border-blue-500/40 p-6 rounded-2xl transition-all shadow-xl space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 ${item.bg} ${item.color} rounded-xl`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-white font-mono">{item.count}</span>
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span>Manage Resources</span>
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
