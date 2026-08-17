"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Eye, 
  QrCode, 
  Share2, 
  Trash2, 
  Edit3, 
  BarChart3, 
  Loader2, 
  Smartphone, 
  ExternalLink,
  MessageSquare,
  PhoneCall,
  MailCheck,
  Globe,
  X
} from "lucide-react";
import QRModal from "@/components/dashboard/QRModal";

interface CardItem {
  _id: string;
  username: string;
  uniqueCode?: string;
  name: string;
  title?: string;
  company?: string;
  profileImage?: string;
  template: string;
  isPublic: boolean;
  createdAt: string;
}

interface StatsData {
  cardsCount: number;
  stats: {
    views: number;
    qr_scans: number;
    whatsapp: number;
    phone: number;
    email: number;
    website: number;
    social_click: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Delete Modal States
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<{ id: string; name: string } | null>(null);

  // QR Modal States
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedProfileImage, setSelectedProfileImage] = useState("");

  const fetchData = async () => {
    try {
      const [cardsRes, statsRes] = await Promise.all([
        fetch("/api/cards"),
        fetch("/api/dashboard/stats")
      ]);

      if (cardsRes.ok) {
        const cardsList = await cardsRes.json();
        setCards(cardsList);
      }

      if (statsRes.ok) {
        const statsList = await statsRes.json();
        setStatsData(statsList);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteConfirm = (id: string, name: string) => {
    setCardToDelete({ id, name });
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setCards(cards.filter((card) => card._id !== id));
        // Refresh statistics
        const statsRes = await fetch("/api/dashboard/stats");
        if (statsRes.ok) {
          const statsList = await statsRes.json();
          if (statsList) setStatsData(statsList);
        }
        setDeleteConfirmOpen(false);
        setCardToDelete(null);
      } else {
        alert("Failed to delete card. Please try again.");
      }
    } catch (err) {
      console.error("Delete card error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleShareClick = (username: string, name: string, profileImage?: string) => {
    setSelectedUsername(username);
    setSelectedName(name);
    setSelectedProfileImage(profileImage || "");
    setQrModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-400 text-sm">Loading your dashboard workspace...</p>
        </div>
      </div>
    );
  }

  // Calculate combined link clicks
  const linkClicks = statsData 
    ? statsData.stats.phone + statsData.stats.email + statsData.stats.website + statsData.stats.social_click
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 text-xs mt-1">
            Manage your credentials, custom digital visiting cards, and view dynamic performance metrics.
          </p>
        </div>
        <Link
          href="/dashboard/cards/new"
          className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-md shadow-primary/10 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Card</span>
        </Link>
      </div>

      {/* Analytics Counter Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card Views */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-primary bg-primary/10 p-1.5 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Total Views</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{statsData?.stats.views || 0}</h2>
        </div>

        {/* WhatsApp Clicks */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-emerald-400 bg-emerald-400/10 p-1.5 rounded-lg">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">WhatsApp</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{statsData?.stats.whatsapp || 0}</h2>
        </div>

        {/* Outbound Link Clicks */}
        <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-2 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-accent bg-accent/10 p-1.5 rounded-lg">
            <ExternalLink className="w-4 h-4" />
          </div>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">Link Clicks</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">{linkClicks}</h2>
        </div>
      </div>

      {/* Cards List Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">My Digital Cards</h2>

        {cards.length === 0 ? (
          /* Empty Card State */
          <div className="glass-panel-premium rounded-2xl p-12 text-center border border-white/5 space-y-6">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
              <Smartphone className="w-8 h-8 animate-pulse" />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-lg font-bold text-white">No active cards found</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                You haven&apos;t built a digital visiting card yet. Launch your first professional card in under five minutes.
              </p>
            </div>
            <div>
              <Link
                href="/dashboard/cards/new"
                className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-lg cursor-pointer animate-bounce"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Card</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cards Grid List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card._id}
                className="glass-panel rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-gray-400">
                      {card.template.replace("_", " ")}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${card.isPublic ? "bg-emerald-400" : "bg-red-400"}`} title={card.isPublic ? "Public" : "Private"}></span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{card.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{card.title || "No Title Specified"}</p>
                    <p className="text-[10px] text-primary hover:underline mt-1 truncate">
                      <a href={`/card/${card.uniqueCode || card.username}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                        dravion.site/card/{card.uniqueCode || card.username}
                        <ExternalLink className="w-2.5 h-2.5 ml-1" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Operations Panel */}
                <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-white/5">
                  {/* Edit */}
                  <Link
                    href={`/dashboard/cards/edit/${card._id}`}
                    title="Edit Card"
                    className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  {/* Share QR */}
                  <button
                    onClick={() => handleShareClick(card.uniqueCode || card.username, card.name, card.profileImage)}
                    title="Share QR"
                    className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  {/* View Stats detail */}
                  <Link
                    href={`/dashboard/analytics/${card._id}`}
                    title="View Analytics"
                    className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-gray-300 cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Link>
                  {/* Delete */}
                  <button
                    onClick={() => openDeleteConfirm(card._id, card.name)}
                    disabled={deletingId === card._id}
                    title="Delete Card"
                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 hover:border-red-500/30 transition-all text-red-400 cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === card._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR sharing modal render */}
      <QRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        username={selectedUsername}
        cardName={selectedName}
        profileImage={selectedProfileImage}
      />

      {/* Sleek Delete Confirmation Modal */}
      {deleteConfirmOpen && cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => !deletingId && setDeleteConfirmOpen(false)}></div>
          <div className="glass-panel-premium w-full max-w-sm rounded-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200 text-center space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center">
                <Trash2 className="w-4.5 h-4.5 mr-2 text-red-400 animate-pulse" /> Delete Digital Card
              </h3>
              <button 
                onClick={() => !deletingId && setDeleteConfirmOpen(false)} 
                className="text-gray-400 hover:text-white cursor-pointer disabled:opacity-50"
                disabled={!!deletingId}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-350 leading-relaxed">
                Are you sure you want to permanently delete <span className="font-bold text-white">&quot;{cardToDelete.name}&quot;</span>?
              </p>
              <p className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/10 px-3 py-2 rounded-lg">
                Warning: This action is permanent and cannot be undone. The digital card link will stop working immediately.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={!!deletingId}
                className="flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2 rounded-lg text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(cardToDelete.id)}
                disabled={!!deletingId}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Card</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
