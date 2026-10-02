"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, FileText, Trash2, ArrowRight } from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      let guestId = localStorage.getItem("study_guest_id");
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substring(2)}`;
        localStorage.setItem("study_guest_id", guestId);
      }
      const res = await fetch(`/api/study/bookmarks?guestId=${guestId}`);
      const data = await res.json();
      setBookmarks(data.bookmarks || []);
    } catch {
      // Ignore error
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (targetId: string, targetType: string) => {
    try {
      const guestId = localStorage.getItem("study_guest_id");
      await fetch("/api/study/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId, targetType, guestId }),
      });
      setBookmarks((prev) => prev.filter((b) => b.targetId !== targetId));
    } catch {
      // Ignore error
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-white/10 pb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold">
          <Bookmark className="w-3.5 h-3.5 fill-amber-400" />
          <span>Saved Collection</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your Bookmarks</h1>
        <p className="text-sm text-gray-400">Quick access to all your saved notes, subjects, and study materials.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-400">Loading saved bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="p-12 text-center bg-[#141720] border border-white/10 rounded-2xl text-gray-400 space-y-3">
          <Bookmark className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs max-w-sm mx-auto">
            Click the bookmark icon on any note or PDF to save it here for offline revision.
          </p>
          <Link
            href="/study/semesters"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow"
          >
            <span>Browse Subjects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarks.map((bm) => (
            <div
              key={bm._id}
              className="bg-[#141720] border border-white/10 p-5 rounded-xl flex items-start justify-between gap-4"
            >
              <div className="space-y-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {bm.targetType}
                </span>
                <h3 className="text-sm font-semibold text-white truncate">
                  {bm.details?.title || bm.details?.name || "Bookmarked Resource"}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {bm.details?.subjectId?.name || "Study Document"}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {bm.details?.fileUrl && (
                  <a
                    href={`/api/study/pdf-proxy?url=${encodeURIComponent(bm.details.fileUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                  >
                    Open
                  </a>
                )}
                <button
                  onClick={() => removeBookmark(bm.targetId, bm.targetType)}
                  className="p-2 bg-white/5 hover:bg-rose-500/20 border border-white/10 text-gray-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
