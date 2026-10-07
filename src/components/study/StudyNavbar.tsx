"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  GraduationCap,
  Search,
  Bookmark,
  TrendingUp,
  Download,
  BookOpen,
  User,
  Shield,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

export default function StudyNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = (session?.user as any)?.role === "admin";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/study/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: "Semesters", href: "/study/semesters", icon: BookOpen },
    { name: "Bookmarks", href: "/study/bookmarks", icon: Bookmark },
    { name: "Downloads", href: "/study/downloads", icon: Download },
    { name: "Progress", href: "/study/progress", icon: TrendingUp },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/study" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-wide">DRAVION</span>
                  <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                    STUDY
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden sm:block">Study smarter. Prepare better.</p>
              </div>
            </Link>
          </div>

          {/* Quick Search bar on Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, chapters, notes..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
          </form>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Admin Link if admin */}
            {isAdmin && (
              <Link
                href="/study/admin"
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="flex items-center space-x-2">
            <Link
              href="/study/profile"
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 animate-in fade-in slide-in-from-top-2 shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects, notes..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                      active
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {isAdmin && (
              <Link
                href="/study/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-semibold"
              >
                <Shield className="w-4 h-4" />
                <span>Admin Content Panel</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
