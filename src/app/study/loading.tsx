import React from "react";
import { BookOpen, Sparkles, Loader2 } from "lucide-react";

export default function StudyLoading() {
  return (
    <div className="min-h-[75vh] w-full flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-300">
      {/* Animated Glowing Logo / Spinner Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-2xl bg-[#161a26] border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-2xl">
          <BookOpen className="w-10 h-10 animate-pulse text-blue-400" />
          <Sparkles className="w-4 h-4 text-amber-400 absolute top-2 right-2 animate-bounce" />
        </div>
      </div>

      {/* Loading Status Message */}
      <div className="text-center space-y-2 max-w-sm">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center justify-center space-x-2">
          <span>Loading Dravion Study</span>
          <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
        </h3>
        <p className="text-xs text-gray-400">
          Preparing semester subjects, notes, and question papers...
        </p>
      </div>

      {/* Skeleton Cards Grid Preview */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-[#141720] border border-white/5 p-5 rounded-2xl space-y-3 animate-pulse"
          >
            <div className="w-16 h-5 bg-blue-500/10 rounded-md" />
            <div className="w-3/4 h-5 bg-white/10 rounded-md" />
            <div className="w-full h-3 bg-white/5 rounded" />
            <div className="w-2/3 h-3 bg-white/5 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
