import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import StudyMaterial from "@/models/study/StudyMaterial";
import Question from "@/models/study/Question";
import MCQ from "@/models/study/MCQ";
import { verifyAdmin } from "@/lib/study/adminAuth";
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
  const auth = await verifyAdmin();
  if (!auth.isAdmin && process.env.NODE_ENV !== "development") {
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
    { title: "Semesters", count: semCount, href: "/study/admin/semesters", icon: Layers, color: "text-blue-700", bg: "bg-blue-50" },
    { title: "Subjects", count: subCount, href: "/study/admin/subjects", icon: BookOpen, color: "text-purple-700", bg: "bg-purple-50" },
    { title: "Chapters", count: chCount, href: "/study/admin/chapters", icon: Layers, color: "text-indigo-700", bg: "bg-indigo-50" },
    { title: "Study Materials (PDFs)", count: matCount, href: "/study/admin/materials", icon: FileText, color: "text-emerald-700", bg: "bg-emerald-50" },
    { title: "Exam Questions", count: qCount, href: "/study/admin/questions", icon: HelpCircle, color: "text-amber-700", bg: "bg-amber-50" },
    { title: "Practice MCQs", count: mcqCount, href: "/study/admin/mcqs", icon: Award, color: "text-rose-700", bg: "bg-rose-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Study Content Management</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Manage semesters, course subjects, chapters, PDF note uploads, and MCQs.
          </p>
        </div>

        <Link
          href="/study/admin/materials"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
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
              className="bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl transition-all shadow-xs hover:shadow-md space-y-4 group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-3 ${item.bg} ${item.color} rounded-xl border border-slate-100`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900 font-mono">{item.count}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
                <span>Manage Resources</span>
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
