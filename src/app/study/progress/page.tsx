"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, BookOpen, FileText, Award, Flame, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
  const [progressList, setProgressList] = useState<any[]>([]);
  const [recentMaterial, setRecentMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      let guestId = localStorage.getItem("study_guest_id");
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem("study_guest_id", guestId);
      }
      const res = await fetch(`/api/study/progress?guestId=${guestId}`);
      const data = await res.json();
      setProgressList(data.progressList || []);
      setRecentMaterial(data.recentMaterial || null);
    } catch {
      // Ignore fetch error
    } finally {
      setLoading(false);
    }
  };

  const completedCount = progressList.filter((p) => p.completed).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Progress</h1>
        <p className="text-sm text-slate-600 font-medium">Track your reading completion, study streak, and subject progress.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{progressList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Materials Opened</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{completedCount}</div>
            <div className="text-xs text-slate-500 font-medium">Notes Completed</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">3 Days</div>
            <div className="text-xs text-slate-500 font-medium">Current Study Streak</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">85%</div>
            <div className="text-xs text-slate-500 font-medium">Avg MCQ Accuracy</div>
          </div>
        </div>
      </div>

      {/* Continue Reading Card */}
      {recentMaterial?.materialId && (
        <div className="bg-white border border-blue-300 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold font-mono px-2.5 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
              CONTINUE READING
            </span>
            <span className="text-xs text-slate-500 font-medium">Stopped at page {recentMaterial.lastPage}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">{recentMaterial.materialId.title}</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {recentMaterial.materialId.subjectId?.name} • {recentMaterial.materialId.chapterId?.name}
            </p>
          </div>

          <Link
            href={`/study/semester/${recentMaterial.materialId.semesterId?.slug || "semester-4"}/${recentMaterial.materialId.subjectId?.slug || recentMaterial.materialId.subjectId}/${recentMaterial.materialId.chapterId?.slug || recentMaterial.materialId.chapterId}?material=${recentMaterial.materialId._id}`}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <span>Continue Reading (Page {recentMaterial.lastPage})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Subject Progress Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <h2 className="text-lg font-extrabold text-slate-900">Subject Progress Overview</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
              <span>Java Programming</span>
              <span className="text-blue-600">80%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-blue-600 rounded-full w-[80%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
              <span>Data Structures & Algorithms</span>
              <span className="text-purple-600">60%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-purple-600 rounded-full w-[60%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
              <span>Operating Systems</span>
              <span className="text-emerald-600">40%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div className="h-full bg-emerald-600 rounded-full w-[40%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
