"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Eye, 
  QrCode, 
  Search, 
  Trash2, 
  Check, 
  X,
  Loader2,
  ExternalLink,
  Ban,
  CheckCircle,
  Send,
  Lock
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalCards: number;
  totalViews: number;
  totalScans: number;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface CardItem {
  _id: string;
  username: string;
  uniqueCode?: string;
  name: string;
  title?: string;
  company?: string;
  isPublic: boolean;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
}

export default function AdminPage() {
  const { data: session, status, update } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "cards">("users");
  const [search, setSearch] = useState("");
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<Record<string, "idle" | "sending" | "success" | "error">>({});

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setUsers(data.users || []);
        setCards(data.cards || []);
      }
    } catch (err) {
      console.error("Error loading admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "admin") {
      fetchData();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, session]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await signIn("credentials", {
        email: loginEmail.toLowerCase().trim(),
        password: loginPassword,
        redirect: false
      });

      if (res?.error) {
        setLoginError("Invalid administrator credentials.");
        setLoginLoading(false);
      } else {
        const sessionUpdate = await update();
        if (sessionUpdate?.user && (sessionUpdate.user as any).role === "admin") {
          fetchData();
        } else {
          setLoginError("Access Denied: This account does not possess administrator credentials.");
          setLoginLoading(false);
        }
      }
    } catch (err) {
      console.error("Admin login error:", err);
      setLoginError("An unexpected error occurred during authorization.");
      setLoginLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !currentStatus })
      });

      if (res.ok) {
        setCards(cards.map(c => c._id === id ? { ...c, isPublic: !currentStatus } : c));
      } else {
        alert("Failed to toggle card visibility.");
      }
    } catch (err) {
      console.error("Toggle card error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this card as an administrator? This action is permanent and cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setCards(cards.filter(c => c._id !== id));
        if (stats) setStats({ ...stats, totalCards: stats.totalCards - 1 });
      } else {
        alert("Failed to delete card.");
      }
    } catch (err) {
      console.error("Delete card error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user account? All associated digital cards and analytics logs will be permanently deleted!")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setUsers(users.filter(u => u._id !== id));
        const deletedUserCards = cards.filter(c => c.userId?._id === id || (c as any).userId === id);
        setCards(cards.filter(c => c.userId?._id !== id && (c as any).userId !== id));
        
        if (stats) {
          setStats({
            ...stats,
            totalUsers: stats.totalUsers - 1,
            totalCards: stats.totalCards - deletedUserCards.length
          });
        }
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to delete user account.");
      }
    } catch (err) {
      console.error("Delete user error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendIntroEmail = async (userId: string, email: string, userName: string) => {
    setEmailStatus(prev => ({ ...prev, [userId]: "sending" }));
    try {
      const res = await fetch(`/api/admin/users/${userId}/send-intro`, {
        method: "POST"
      });

      if (res.ok) {
        setEmailStatus(prev => ({ ...prev, [userId]: "success" }));

        // Prefilled Email fields matching the console simulation
        const subject = "Welcome to Dravion - Introduction to Our Services";
        const body = `Dear ${userName},\n\nWelcome to Dravion SaaS suite! We are pleased to introduce our digital business platform.\n\nDravion is a custom development and software design studio offering premium high-performance web systems, custom cloud applications, and AI integrations.\n\nYou can manage and customize your free digital visiting card inside your profile space:\n👉 https://dravion.site/dashboard\n\nBest Regards,\nDravion Tech Studio Team`;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile) {
          // Open standard mailto link to launch mobile system mail client (Gmail app, etc)
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } else {
          // Open Gmail Compose directly in a browser tab for desktop/laptops
          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          window.open(gmailUrl, "_blank");
        }

        setTimeout(() => {
          setEmailStatus(prev => ({ ...prev, [userId]: "idle" }));
        }, 3000);
      } else {
        setEmailStatus(prev => ({ ...prev, [userId]: "error" }));
      }
    } catch (err) {
      console.error("Send email error:", err);
      setEmailStatus(prev => ({ ...prev, [userId]: "error" }));
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCards = cards.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.userId?.name.toLowerCase().includes(search.toLowerCase()) ||
    c.userId?.email.toLowerCase().includes(search.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-400 text-sm font-sans">Opening administrator workspace...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 py-16 bg-grid-pattern relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="glass-panel-premium w-full max-w-md rounded-2xl p-8 border border-white/5 space-y-6 relative z-10 font-sans">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Authorization Portal</h1>
            <p className="text-xs text-gray-400">Please authenticate to gain operational terminal access.</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Security Token Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
              />
            </div>

            {loginError && (
              <div className="text-[11px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
              ) : (
                <span>Authenticate Workspace</span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 font-sans max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center">
            <ShieldCheck className="w-7 h-7 mr-2 text-primary" /> Dravion Admin Portal
          </h1>
          <p className="text-xs text-gray-400">
            Monitor system metrics, review registered users, send company intros, and moderate digital business cards.
          </p>
        </div>
        <Link 
          href="/dashboard" 
          className="text-xs font-bold text-gray-400 hover:text-white px-3.5 py-2 bg-white/5 border border-white/10 rounded-lg transition-all"
        >
          Go to User Panel
        </Link>
      </div>

      {/* Global stats grids */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden bg-black/40">
          <div className="absolute top-4 right-4 text-primary bg-primary/10 p-1.5 rounded-lg">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Users</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.totalUsers || 0}</h2>
        </div>

        {/* Cards */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden bg-black/40">
          <div className="absolute top-4 right-4 text-secondary bg-secondary/10 p-1.5 rounded-lg">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Cards</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.totalCards || 0}</h2>
        </div>

        {/* Views */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden bg-black/40">
          <div className="absolute top-4 right-4 text-emerald-400 bg-emerald-400/10 p-1.5 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Views</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.totalViews || 0}</h2>
        </div>

        {/* Scans */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden bg-black/40">
          <div className="absolute top-4 right-4 text-accent bg-accent/10 p-1.5 rounded-lg">
            <QrCode className="w-4 h-4" />
          </div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Scans</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{stats?.totalScans || 0}</h2>
        </div>
      </div>

      {/* Navigation Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex bg-white/5 border border-white/15 p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab("users"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "users" 
                ? "bg-gradient-to-r from-primary to-accent text-white shadow" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            User Moderation
          </button>
          <button
            onClick={() => { setActiveTab("cards"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "cards" 
                ? "bg-gradient-to-r from-primary to-accent text-white shadow" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Card Moderation
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder={activeTab === "users" ? "Search user name, email..." : "Search user, slug, or card name..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs placeholder-gray-500 text-white focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      {/* Main List Workspace */}
      <div className="space-y-4">
        {activeTab === "users" ? (
          /* User Moderation List */
          filteredUsers.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-500 text-xs italic bg-black/20 rounded-2xl border border-white/5">
              No registered user accounts found matching search keywords.
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#070a13] border border-white/5 rounded-2xl shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Registered User</th>
                    <th className="p-4">Account Role</th>
                    <th className="p-4">Joined Date</th>
                    <th className="p-4 text-center">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{user.name}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{user.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          user.role === "admin"
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-gray-500/10 border-white/5 text-gray-400"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 font-mono">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-3">
                          {/* Send introduction mail */}
                          <button
                            onClick={() => handleSendIntroEmail(user._id, user.email, user.name)}
                            disabled={emailStatus[user._id] === "sending" || user.role === "admin"}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                              emailStatus[user._id] === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : emailStatus[user._id] === "error"
                                ? "bg-red-500/10 border-red-500/20 text-red-400"
                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                            } disabled:opacity-30 disabled:cursor-not-allowed`}
                            title="Send Company Intro Email"
                          >
                            {emailStatus[user._id] === "sending" ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Sending...</span>
                              </>
                            ) : emailStatus[user._id] === "success" ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Sent!</span>
                              </>
                            ) : emailStatus[user._id] === "error" ? (
                              <>
                                <X className="w-3.5 h-3.5" />
                                <span>Failed</span>
                              </>
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Send Intro</span>
                              </>
                            )}
                          </button>

                          {/* Delete Account */}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deletingId === user._id || user._id === (session?.user as any)?.id}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete User Account"
                          >
                            {deletingId === user._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete User</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* Card Moderation List */
          filteredCards.length === 0 ? (
            <div className="glass-panel p-12 text-center text-gray-500 text-xs italic bg-black/20 rounded-2xl border border-white/5">
              No registered digital business cards found matching search keywords.
            </div>
          ) : (
            <div className="overflow-x-auto bg-[#070a13] border border-white/5 rounded-2xl shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Owner Account</th>
                    <th className="p-4">Card Profile Info</th>
                    <th className="p-4">Visibility</th>
                    <th className="p-4 text-center">Operational Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCards.map((card) => (
                    <tr key={card._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white">{card.userId?.name || "Deleted User"}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{card.userId?.email || "-"}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{card.name}</div>
                        <div className="text-[10px] text-primary hover:underline mt-0.5">
                          <a href={`/card/${card.uniqueCode || card.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-mono">
                            /card/{card.uniqueCode || card.username}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </div>
                      </td>
                      <td className="p-4">
                        {card.isPublic ? (
                          <span className="inline-flex items-center text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center space-x-2">
                          {/* Disable/Enable Toggle */}
                          <button
                            onClick={() => toggleStatus(card._id, card.isPublic)}
                            disabled={updatingId === card._id}
                            className={`flex items-center justify-center p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              card.isPublic 
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/25"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25"
                            } disabled:opacity-50`}
                            title={card.isPublic ? "Disable Card" : "Enable Card"}
                          >
                            {updatingId === card._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : card.isPublic ? (
                              <Ban className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Force delete */}
                          <button
                            onClick={() => handleDeleteCard(card._id)}
                            disabled={deletingId === card._id}
                            className="flex items-center justify-center p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 cursor-pointer disabled:opacity-50"
                            title="Delete Card"
                          >
                            {deletingId === card._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
