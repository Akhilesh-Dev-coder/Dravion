import React from "react";
import Link from "next/link";
import { GraduationCap, ExternalLink } from "lucide-react";

export default function StudyFooter() {
  return (
    <footer className="w-full bg-[#0a0c0f] border-t border-white/10 py-10 mt-auto text-xs text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start space-y-1 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white text-base tracking-wide">Dravion Study</span>
            </div>
            <p className="text-gray-400 text-xs">
              Semester notes, question papers, and revision resources for university students.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400">
            <Link href="/study" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/study/semesters" className="hover:text-white transition-colors">
              Semesters
            </Link>
            <Link href="/study/search" className="hover:text-white transition-colors">
              Search
            </Link>
            <Link href="/study/bookmarks" className="hover:text-white transition-colors">
              Bookmarks
            </Link>
            <Link href="/study/downloads" className="hover:text-white transition-colors">
              Downloads
            </Link>
            <Link href="/study/progress" className="hover:text-white transition-colors">
              Progress
            </Link>
          </div>

          {/* Dravion Branding */}
          <div className="flex items-center space-x-1.5 text-gray-400">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>Dravion Technologies</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-6 text-center text-gray-500 text-[11px]">
          © {new Date().getFullYear()} Dravion Technologies. All study materials provided for educational purposes.
        </div>
      </div>
    </footer>
  );
}
