import React from "react";
import { BookOpen, Loader2 } from "lucide-react";

export default function SemesterDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
          <BookOpen className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <span>Loading Semester Subjects</span>
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
          </h1>
          <p className="text-xs text-gray-400">Loading course materials & chapters...</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#141720] border border-white/5 p-6 rounded-2xl space-y-4 animate-pulse">
            <div className="w-full h-36 bg-white/5 rounded-xl" />
            <div className="w-3/4 h-5 bg-white/10 rounded" />
            <div className="w-full h-3 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
