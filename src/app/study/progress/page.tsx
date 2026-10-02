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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Progress</h1>
        <p className="text-sm text-gray-400">Track your reading completion, study streak, and subject progress.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141720] border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{progressList.length}</div>
            <div className="text-xs text-gray-400">Materials Opened</div>
          </div>
        </div>

        <div className="bg-[#141720] border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">{completedCount}</div>
            <div className="text-xs text-gray-400">Notes Completed</div>
          </div>
        </div>

        <div className="bg-[#141720] border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">3 Days</div>
            <div className="text-xs text-gray-400">Current Study Streak</div>
          </div>
        </div>

        <div className="bg-[#141720] border border-white/10 p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white">85%</div>
            <div className="text-xs text-gray-400">Avg MCQ Accuracy</div>
          </div>
        </div>
      </div>

      {/* Continue Reading Card */}
      {recentMaterial?.materialId && (
        <div className="bg-[#141720] border border-blue-500/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
              CONTINUE READING
            </span>
            <span className="text-xs text-gray-400">Stopped at page {recentMaterial.lastPage}</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{recentMaterial.materialId.title}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {recentMaterial.materialId.subjectId?.name} • {recentMaterial.materialId.chapterId?.name}
            </p>
          </div>

          <Link
            href={`/study/semester/${recentMaterial.materialId.semesterId?.slug || "semester-4"}/${recentMaterial.materialId.subjectId?.slug || recentMaterial.materialId.subjectId}/${recentMaterial.materialId.chapterId?.slug || recentMaterial.materialId.chapterId}?material=${recentMaterial.materialId._id}`}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow cursor-pointer transition-all"
          >
            <span>Continue Reading (Page {recentMaterial.lastPage})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Subject Progress Breakdown */}
      <div className="bg-[#141720] border border-white/10 rounded-2xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white">Subject Progress Overview</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Java Programming</span>
              <span className="text-blue-400">80%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[80%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Data Structures & Algorithms</span>
              <span className="text-purple-400">60%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[60%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-white mb-1.5">
              <span>Operating Systems</span>
              <span className="text-emerald-400">40%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[40%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
