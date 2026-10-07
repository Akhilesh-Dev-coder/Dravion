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

  // Calculate study streak (distinct activity days)
  const calculateStreak = () => {
    if (progressList.length === 0) return 1;
    const days = new Set(
      progressList.map((p) => new Date(p.lastOpenedAt || p.updatedAt).toDateString())
    );
    return Math.max(1, days.size);
  };

  // Group progress by subject
  const subjectProgressMap = progressList.reduce((acc: any, p: any) => {
    const subName = p.materialId?.subjectId?.name || "General Subject";
    if (!acc[subName]) {
      acc[subName] = { total: 0, completed: 0 };
    }
    acc[subName].total += 1;
    if (p.completed) acc[subName].completed += 1;
    return acc;
  }, {});

  const subjectEntries = Object.entries(subjectProgressMap);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 text-slate-900 min-h-screen">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Learning Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Your Study Progress</h1>
        <p className="text-sm text-slate-600 font-medium">Track your reading completion, study streak, and subject progress.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading learning analytics...</div>
      ) : (
        <>
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
                <div className="text-2xl font-extrabold text-slate-900">{calculateStreak()} Days</div>
                <div className="text-xs text-slate-500 font-medium">Active Study Streak</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center space-x-4 shadow-xs">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">
                  {progressList.length > 0 ? Math.round((completedCount / progressList.length) * 100) : 100}%
                </div>
                <div className="text-xs text-slate-500 font-medium">Overall Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Continue Reading Card */}
          {recentMaterial?.materialId && (() => {
            const mat = recentMaterial.materialId;
            const semSlug = mat.semesterId?.slug || `semester-${mat.semesterId?.number || 1}`;
            const subSlug = mat.subjectId?.slug || mat.subjectId?._id || mat.subjectId;
            const chSlug = mat.chapterId?.slug || mat.chapterId?._id || mat.chapterId;
            const continueUrl = semSlug && subSlug && chSlug
              ? `/study/semester/${semSlug}/${subSlug}/${chSlug}?material=${mat._id}`
              : `/api/study/pdf-proxy?url=${encodeURIComponent(mat.fileUrl)}`;

            return (
              <div className="bg-white border border-blue-300 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold font-mono px-2.5 py-1 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    CONTINUE READING
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Stopped at Page {recentMaterial.lastPage || 1}</span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{mat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {mat.subjectId?.name || "Subject Note"} • {mat.chapterId?.name || "Chapter Material"}
                  </p>
                </div>

                <Link
                  href={continueUrl}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer transition-all"
                >
                  <span>Resume Reading (Page {recentMaterial.lastPage || 1})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })()}

          {/* Subject Progress Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <h2 className="text-lg font-extrabold text-slate-900">Subject Progress Overview</h2>

            {subjectEntries.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">
                Start reading course notes to see your subject completion progress breakdown here.
              </p>
            ) : (
              <div className="space-y-4">
                {subjectEntries.map(([subName, info]: [string, any]) => {
                  const percent = Math.min(100, Math.round((info.completed / Math.max(1, info.total)) * 100)) || 50;
                  return (
                    <div key={subName}>
                      <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                        <span>{subName}</span>
                        <span className="text-blue-600">{percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
