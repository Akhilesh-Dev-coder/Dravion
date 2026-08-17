"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Settings, 
  LogOut, 
  Home, 
  Menu, 
  X, 
  User,
  ShieldCheck
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Admin Portal", href: "/admin", icon: <ShieldCheck className="w-4 h-4" />, adminOnly: true },
    { name: "Back to Site", href: "/", icon: <Home className="w-4 h-4" /> },
  ];

  const isActive = (href: string) => pathname === href;

  // Filter links based on user role
  const filteredLinks = sidebarLinks.filter(
    (link) => !link.adminOnly || (session?.user as any)?.role === "admin"
  );

  return (
    <div className="min-h-screen flex bg-[#030712] text-gray-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col fixed inset-y-0 left-0 bg-[#070a13] border-r border-white/5 z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="text-lg font-bold tracking-wider text-gradient-primary">
            DRAVION
          </Link>
          <span className="text-[9px] bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded ml-2 font-bold uppercase tracking-wider">
            SaaS
          </span>
        </div>

        <nav className="flex-grow p-4 space-y-1.5">
          {filteredLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.href)
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Card & Log Out */}
        <div className="p-4 border-t border-white/5 bg-[#0a0f1d] flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold uppercase">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{session?.user?.name || "User"}</h4>
              <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-[#070a13] border-b border-white/5 md:hidden sticky top-0 z-30">
          <Link href="/" className="text-lg font-bold tracking-wider text-gradient-primary">
            DRAVION
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 text-gray-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu Panel */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/80 flex animate-in fade-in duration-200">
            <div className="w-64 bg-[#070a13] border-r border-white/5 flex flex-col justify-between p-4">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <span className="text-base font-bold tracking-wider text-gradient-primary">DRAVION</span>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1.5">
                  {filteredLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(link.href)
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col space-y-3 bg-[#0a0f1d] p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold uppercase">
                    {session?.user?.name?.[0] || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{session?.user?.name || "User"}</h4>
                    <p className="text-[10px] text-gray-500 truncate">{session?.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 py-2 rounded-lg text-xs font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            {/* Click backdrop to close */}
            <div className="flex-grow" onClick={() => setSidebarOpen(false)}></div>
          </div>
        )}

        {/* Content Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
}
