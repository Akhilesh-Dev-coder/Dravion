"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BarChart3, 
  Eye, 
  QrCode, 
  MessageSquare, 
  Phone, 
  Mail, 
  Globe, 
  ExternalLink,
  Loader2
} from "lucide-react";

interface StatsData {
  cardName: string;
  username: string;
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

export default function AnalyticsClient({ cardId }: { cardId: string }) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/cards/${cardId}/stats`);
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        } else {
          setError("Failed to fetch analytics logs.");
        }
      } catch (err) {
        console.error("Error fetching card stats:", err);
        setError("Network error fetching statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [cardId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-gray-400 text-sm">Compiling card logs and statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error || "Failed to load details."}</div>
        <Link href="/dashboard" className="text-sm text-primary hover:underline font-semibold block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { cardName, username, stats } = data;
  const totalInteractions = stats.views + stats.qr_scans + stats.whatsapp + stats.phone + stats.email + stats.website + stats.social_click;

  const metrics = [
    { label: "Page Views", count: stats.views, icon: <Eye className="w-4 h-4 text-primary" />, color: "bg-primary" },
    { label: "QR Code Scans", count: stats.qr_scans, icon: <QrCode className="w-4 h-4 text-secondary" />, color: "bg-secondary" },
    { label: "WhatsApp Clicks", count: stats.whatsapp, icon: <MessageSquare className="w-4 h-4 text-emerald-400" />, color: "bg-emerald-400" },
    { label: "Phone Call Dials", count: stats.phone, icon: <Phone className="w-4 h-4 text-blue-400" />, color: "bg-blue-400" },
    { label: "Email Clicks", count: stats.email, icon: <Mail className="w-4 h-4 text-indigo-400" />, color: "bg-indigo-400" },
    { label: "Website Redirects", count: stats.website, icon: <Globe className="w-4 h-4 text-amber-400" />, color: "bg-amber-400" },
    { label: "Social Link Clicks", count: stats.social_click, icon: <ExternalLink className="w-4 h-4 text-accent" />, color: "bg-accent" }
  ];

  const getPercentage = (count: number) => {
    if (stats.views === 0) return 0;
    return Math.round((count / stats.views) * 100);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header navigations */}
      <div className="space-y-2 pb-4 border-b border-white/5">
        <Link href="/dashboard" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" /> {cardName} Analytics
            </h1>
            <p className="text-xs text-gray-400">
              Visitor performance data for card link <span className="text-primary hover:underline">/card/{username}</span>.
            </p>
          </div>
          <a
            href={`/card/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-secondary hover:underline flex items-center font-bold"
          >
            <span>Open Public Card</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Main card metrics layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Interaction Volume</h3>
            <span className="text-3xl font-extrabold text-white">{totalInteractions}</span>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
              Sum of all views, QR scans, and outbound clicks recorded for this card.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1.5 text-[11px] leading-relaxed text-gray-300">
            <span className="font-bold text-white block mb-0.5">Interaction Ratio</span>
            <p>
              Outbound clicks indicate visitor engagement. A higher click-through count relative to views shows successful networking.
            </p>
          </div>
        </div>

        {/* Detailed Metrics List */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Event Types Distribution</h3>
          
          <div className="space-y-4">
            {metrics.map((metric) => {
              const pct = getPercentage(metric.count);
              return (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-2 text-gray-300">
                      {metric.icon}
                      <span className="font-semibold">{metric.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{metric.count}</span>
                      {metric.label !== "Page Views" && (
                        <span className="text-[10px] text-gray-500">({pct}% of views)</span>
                      )}
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, metric.label === "Page Views" ? 100 : pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
