"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ArrowRight, User } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "Products", href: "/products" },
    { name: "Digital Card", href: "/digital-card" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass-panel border-x-0 border-t-0 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-wider text-gradient-primary">
              DRAVION
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${
                  isActive(link.href) ? "text-white font-semibold" : "text-gray-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center space-x-1 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-primary/10 cursor-pointer"
                >
                  <span>Create Free Card</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-400 hover:text-white focus:outline-none p-1.5 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-x-0 border-b-0 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? "bg-white/10 text-white font-semibold"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-4 pb-2 px-3 flex flex-col space-y-3">
              {status === "loading" ? (
                <div className="h-10 bg-white/5 rounded animate-pulse" />
              ) : session ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white font-medium py-1"
                  >
                    <User className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left text-gray-400 hover:text-white font-medium py-1 cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-300 hover:text-white font-medium py-1"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent text-white font-medium py-2 rounded-lg"
                  >
                    <span>Create Free Card</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
