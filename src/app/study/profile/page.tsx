"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, LogIn, Shield, Bookmark, Download, TrendingUp, LogOut } from "lucide-react";

export default function StudyProfilePage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-[#141720] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 shadow-xl">
        <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-2xl font-bold">
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-2xl font-extrabold text-white">
            {session?.user?.name || "Student Portal User"}
          </h1>
          <p className="text-xs text-gray-400">{session?.user?.email || "Guest Learning Session"}</p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Role: {(session?.user as any)?.role || "Student"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/study/bookmarks"
          className="bg-[#141720] border border-white/10 hover:border-amber-500/40 p-5 rounded-xl flex items-center space-x-3 text-gray-200 transition-all"
        >
          <Bookmark className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold">Saved Bookmarks</span>
        </Link>
        <Link
          href="/study/downloads"
          className="bg-[#141720] border border-white/10 hover:border-emerald-500/40 p-5 rounded-xl flex items-center space-x-3 text-gray-200 transition-all"
        >
          <Download className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">Downloaded PDFs</span>
        </Link>
        <Link
          href="/study/progress"
          className="bg-[#141720] border border-white/10 hover:border-blue-500/40 p-5 rounded-xl flex items-center space-x-3 text-gray-200 transition-all"
        >
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold">Study Progress</span>
        </Link>
      </div>

      {/* Admin Panel Access if Admin */}
      {(session?.user as any)?.role === "admin" && (
        <div className="p-6 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <Shield className="w-5 h-5" />
            <h3 className="text-base font-bold">Study Content Management</h3>
          </div>
          <p className="text-xs text-amber-200/80">
            You have administrator privileges. Manage semesters, subjects, upload PDFs, and create exam questions.
          </p>
          <Link
            href="/study/admin"
            className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-xl transition-all"
          >
            Open Admin Dashboard
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-white/10 flex justify-end">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/study" })}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow cursor-pointer transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Sync Progress</span>
          </Link>
        )}
      </div>
    </div>
  );
}
