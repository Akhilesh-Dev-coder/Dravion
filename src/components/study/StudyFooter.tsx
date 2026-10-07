import React from "react";
import Link from "next/link";
import { GraduationCap, ExternalLink } from "lucide-react";

export default function StudyFooter() {
  return (
    <footer className="w-full bg-slate-100 border-t border-slate-200 py-10 mt-auto text-xs text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <span className="font-extrabold text-slate-900 text-base tracking-wide">Dravion Study</span>
            </div>
            <p className="text-slate-500 text-xs">
              Semester notes, question papers, and revision resources for university students.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
            <Link href="/study" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/study/semesters" className="hover:text-blue-600 transition-colors">
              Semesters
            </Link>
            <Link href="/study/search" className="hover:text-blue-600 transition-colors">
              Search
            </Link>
            <Link href="/study/bookmarks" className="hover:text-blue-600 transition-colors">
              Bookmarks
            </Link>
            <Link href="/study/downloads" className="hover:text-blue-600 transition-colors">
              Downloads
            </Link>
            <Link href="/study/progress" className="hover:text-blue-600 transition-colors">
              Progress
            </Link>
          </div>

          {/* Dravion Branding */}
          <div className="flex items-center space-x-1.5 text-slate-600">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 transition-colors"
            >
              <span>Dravion Technologies</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 text-center text-slate-400 text-[11px]">
          © {new Date().getFullYear()} Dravion Technologies. All study materials provided for educational purposes.
        </div>
      </div>
    </footer>
  );
}
