"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Smartphone, Check, X, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function NewCardPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Username status indicators
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  // Debounce username check
  useEffect(() => {
    if (!username) {
      setUsernameAvailable(null);
      setUsernameError(null);
      return;
    }

    const clean = username.toLowerCase().trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
      setUsernameAvailable(false);
      setUsernameError("Only letters, numbers, underscores, and hyphens allowed");
      return;
    }

    setUsernameChecking(true);
    setUsernameError(null);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/cards/check-username?username=${clean}`);
        const data = await res.json();
        
        if (res.ok && data.available) {
          setUsernameAvailable(true);
        } else {
          setUsernameAvailable(false);
          setUsernameError(data.error || data.message || "Username is taken");
        }
      } catch (err) {
        console.error("Error verifying username:", err);
      } finally {
        setUsernameChecking(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !username.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (usernameAvailable === false) {
      setError("Please select an available username.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          username: username.toLowerCase().trim()
        })
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/dashboard/cards/edit/${data._id}`);
      } else {
        setError(data.error || "Failed to create card.");
        setLoading(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6 animate-in fade-in duration-200">
      {/* Return button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="glass-panel-premium p-8 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center text-primary">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Create Digital Card</h1>
            <p className="text-[11px] text-gray-400">Initialize display names and card link handles.</p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
            <input
              type="text"
              required
              placeholder="Akhilesh AS"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all animate-none"
            />
          </div>

          {/* Username handle */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Card Link Slug</label>
              {usernameChecking ? (
                <span className="text-[9px] text-gray-500 flex items-center">
                  <Loader2 className="w-2.5 h-2.5 animate-spin mr-1" /> checking
                </span>
              ) : usernameAvailable === true ? (
                <span className="text-[9px] text-emerald-400 flex items-center font-bold">
                  <Check className="w-3 h-3 mr-0.5" /> Available
                </span>
              ) : usernameAvailable === false ? (
                <span className="text-[9px] text-red-400 flex items-center font-bold">
                  <X className="w-3 h-3 mr-0.5" /> Taken
                </span>
              ) : null}
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-xs font-semibold select-none">
                dravion.site/card/
              </span>
              <input
                type="text"
                required
                placeholder="akhilesh"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                className="w-full pl-32 pr-4 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            {usernameError && (
              <p className="text-[9px] text-red-400 font-medium mt-1">{usernameError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || usernameAvailable === false || usernameChecking}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold py-2.5 rounded-lg text-xs transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Initializing builder...</span>
              </>
            ) : (
              <>
                <span>Configure Card details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
