"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, BookOpen, FileText, HelpCircle, ChevronRight, Layers, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    subjects: any[];
    chapters: any[];
    materials: any[];
    questions: any[];
  }>({
    subjects: [],
    chapters: [],
    materials: [],
    questions: [],
  });

  const fetchResults = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ subjects: [], chapters: [], materials: [], questions: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/study/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(data);
    } catch {
      // Ignore search fetch errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/study/search?q=${encodeURIComponent(query.trim())}`);
      fetchResults(query.trim());
    }
  };

  const hasResults =
    results.subjects.length > 0 ||
    results.chapters.length > 0 ||
    results.materials.length > 0 ||
    results.questions.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header Form */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">Search Study Materials</h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Search across subjects, chapters, PDF notes, previous questions, and MCQs.
        </p>

        <form onSubmit={handleSearch} className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e.g. String class, Java, Semester 4, Linked List..."
            className="w-full pl-12 pr-28 py-4 bg-[#141720] border border-white/15 rounded-2xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 shadow-2xl transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Search"}
          </button>
        </form>
      </div>

      {/* Results Container */}
      {loading ? (
        <div className="py-16 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
          <p className="text-sm">Searching study resources...</p>
        </div>
      ) : !hasResults && initialQuery ? (
        <div className="p-12 text-center bg-[#141720] border border-white/10 rounded-2xl text-gray-400 space-y-2">
          <Search className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No matches found for "{initialQuery}"</h3>
          <p className="text-xs">Try searching for keywords like "Java", "Semester", "Notes", or "String".</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Subjects Results */}
          {results.subjects.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-white/10 pb-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span>Matching Subjects ({results.subjects.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.subjects.map((sub: any) => (
                  <Link
                    key={sub._id}
                    href={`/study/semester/${sub.semesterId?.slug || sub.semesterId}/${sub.slug || sub._id}`}
                    className="p-4 bg-[#141720] hover:bg-[#181c28] border border-white/10 hover:border-blue-500/40 rounded-xl transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                        {sub.code}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">{sub.name}</h3>
                      <p className="text-xs text-gray-400">{sub.semesterId?.name}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Study Materials Results */}
          {results.materials.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-white/10 pb-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Study Materials & PDFs ({results.materials.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.materials.map((mat: any) => (
                  <div
                    key={mat._id}
                    className="p-4 bg-[#141720] border border-white/10 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {mat.type}
                      </span>
                      <h3 className="text-sm font-semibold text-white truncate">{mat.title}</h3>
                      <p className="text-xs text-gray-400 truncate">
                        {mat.subjectId?.name} • {mat.chapterId?.name}
                      </p>
                    </div>
                    <Link
                      href={`/study/semester/${mat.semesterId?.slug || "semester-4"}/${mat.subjectId?.slug || mat.subjectId}/${mat.chapterId?.slug || mat.chapterId}?material=${mat._id}`}
                      className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Read PDF
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Questions Results */}
          {results.questions.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-white/10 pb-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <span>Important Exam Questions ({results.questions.length})</span>
              </h2>
              <div className="space-y-3">
                {results.questions.map((q: any) => (
                  <div key={q._id} className="p-4 bg-[#141720] border border-white/10 rounded-xl space-y-1">
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      ⭐ {q.marks || 5} Marks Question
                    </span>
                    <h4 className="text-sm font-semibold text-white pt-1">{q.question}</h4>
                    {q.answer && <p className="text-xs text-gray-400">{q.answer}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
