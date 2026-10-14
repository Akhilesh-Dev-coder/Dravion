"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, Shield, Bookmark, Download, TrendingUp, LogOut } from "lucide-react";

export default function StudyProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8 bg-slate-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-2xl font-bold shadow-xs shrink-0">
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">
            {session?.user?.name || "Student Portal User"}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{session?.user?.email || "Guest Learning Session"}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Role: {(session?.user as any)?.role || "Student"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/study/bookmarks"
          className="bg-white border border-slate-200 hover:border-amber-400 p-5 rounded-2xl flex items-center space-x-3 text-slate-800 transition-all shadow-xs hover:shadow-sm"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold block text-slate-900">Saved Bookmarks</span>
            <span className="text-[11px] text-slate-500">Review marked notes</span>
          </div>
        </Link>
        <Link
          href="/study/downloads"
          className="bg-white border border-slate-200 hover:border-emerald-400 p-5 rounded-2xl flex items-center space-x-3 text-slate-800 transition-all shadow-xs hover:shadow-sm"
        >
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold block text-slate-900">Downloaded PDFs</span>
            <span className="text-[11px] text-slate-500">Offline study vault</span>
          </div>
        </Link>
        <Link
          href="/study/progress"
          className="bg-white border border-slate-200 hover:border-blue-400 p-5 rounded-2xl flex items-center space-x-3 text-slate-800 transition-all shadow-xs hover:shadow-sm"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-sm font-bold block text-slate-900">Study Progress</span>
            <span className="text-[11px] text-slate-500">Track exam readiness</span>
          </div>
        </Link>
      </div>

      {/* Admin Panel Access if Admin */}
      {(session?.user as any)?.role === "admin" && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center space-x-2 text-amber-800">
            <Shield className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold">Study Content Management</h3>
          </div>
          <p className="text-xs text-amber-700 font-medium">
            You have administrator privileges. Manage semesters, subjects, upload PDFs, and create exam questions.
          </p>
          <Link
            href="/study/admin"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Open Admin Dashboard
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/study" })}
            className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Sync Progress</span>
          </Link>
        )}
      </div>
    </div>
  );
}
