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
    <header className="sticky top-0 z-40 w-full bg-[#0d0f12]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center space-x-3 shrink-0">
            <Link href="/study" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md shadow-blue-500/10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg text-white tracking-wide">DRAVION</span>
                  <span className="bg-blue-600/30 text-blue-400 border border-blue-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                    STUDY
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 hidden sm:block">Study smarter. Prepare better.</p>
              </div>
            </Link>
          </div>

          {/* Quick Search bar on Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, chapters, notes..."
                className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 transition-all"
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
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
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
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors"
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
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
            >
              <User className="w-4 h-4 text-gray-400" />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#14171f] border-b border-white/10 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subjects, notes..."
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium ${
                      active
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
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
                className="flex items-center justify-center space-x-2 w-full py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-semibold"
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
