"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { 
  User, 
  Phone, 
  Share2, 
  Palette, 
  Plus, 
  Trash2, 
  Loader2, 
  ArrowLeft, 
  Save, 
  Eye, 
  Image as ImageIcon,
  Check,
  PlusCircle,
  Briefcase,
  Layers,
  FolderOpen,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import CardTemplate from "@/components/card-templates";

interface IService {
  name: string;
  description: string;
  link?: string;
}

interface ISocialLinks {
  instagram?: string;
  linkedin?: string;
  github?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

interface IPortfolioItem {
  title: string;
  description: string;
  image?: string;
  link?: string;
}

interface ICardData {
  _id: string;
  username: string;
  name: string;
  uniqueCode?: string;
  title?: string;
  company?: string;
  bio?: string;
  profileImage?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  location?: string;
  socialLinks: ISocialLinks;
  services: IService[];
  portfolio: IPortfolioItem[];
  blocks: string[];
  template: "obsidian" | "aurora" | "swiss" | "glass" | "creator" | "corporate";
  customization: {
    accentColor: string;
    fontStyle: string;
    backgroundStyle: string;
    profileShape: "circle" | "rounded" | "square";
    buttonStyle: "square" | "rounded" | "pill";
    themeMode: "light" | "dark";
  };
  isPublic: boolean;
}

const themeColors = [
  { name: "Indigo", hex: "#6366f1" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Orange", hex: "#f97316" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Red", hex: "#ef4444" },
  { name: "Slate", hex: "#64748b" }
];

export default function EditCardClient({ cardId }: { cardId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "social" | "services" | "portfolio" | "layout" | "styling">("basic");
  
  // Mobile preview modal toggle
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Card form state
  const [card, setCard] = useState<ICardData | null>(null);

  // Temporary Service Fields
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceLink, setNewServiceLink] = useState("");

  // Temporary Portfolio Fields
  const [newPortTitle, setNewPortTitle] = useState("");
  const [newPortDesc, setNewPortDesc] = useState("");
  const [newPortImg, setNewPortImg] = useState("");
  const [newPortLink, setNewPortLink] = useState("");

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await fetch(`/api/cards/${cardId}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure nested objects and array structures are correctly initialized
          setCard({
            ...data,
            socialLinks: data.socialLinks || {},
            services: data.services || [],
            portfolio: data.portfolio || [],
            blocks: data.blocks && data.blocks.length > 0 ? data.blocks : ["profile", "about", "contact", "socialLinks", "services", "qrcode"],
            customization: {
              accentColor: data.customization?.accentColor || "#6366f1",
              fontStyle: data.customization?.fontStyle || "font-sans",
              backgroundStyle: data.customization?.backgroundStyle || "grid",
              profileShape: data.customization?.profileShape || "circle",
              buttonStyle: data.customization?.buttonStyle || "rounded",
              themeMode: data.customization?.themeMode || "dark",
            }
          });
        } else {
          setError("Failed to locate card or unauthorized access.");
        }
      } catch (err) {
        console.error("Error fetching card details:", err);
        setError("Error connecting to database.");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  const handleChange = (field: keyof ICardData, value: any) => {
    if (!card) return;
    setCard({
      ...card,
      [field]: value
    });
  };

  const handleNestedChange = (parent: "socialLinks" | "customization", field: string, value: any) => {
    if (!card) return;
    setCard({
      ...card,
      [parent]: {
        ...card[parent],
        [field]: value
      }
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !card) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size cannot exceed 5MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setCard({
          ...card,
          profileImage: data.url
        });
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      alert("Network error during photo upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleAddService = () => {
    if (!newServiceName.trim() || !newServiceDesc.trim() || !card) {
      alert("Service name and description are required.");
      return;
    }

    const updatedServices = [...card.services, {
      name: newServiceName.trim(),
      description: newServiceDesc.trim(),
      link: newServiceLink.trim() || undefined
    }];

    setCard({
      ...card,
      services: updatedServices
    });

    setNewServiceName("");
    setNewServiceDesc("");
    setNewServiceLink("");
  };

  const handleRemoveService = (index: number) => {
    if (!card) return;
    const updatedServices = card.services.filter((_, idx) => idx !== index);
    setCard({
      ...card,
      services: updatedServices
    });
  };

  const handleAddPortfolioItem = () => {
    if (!newPortTitle.trim() || !card) {
      alert("Portfolio item title is required.");
      return;
    }

    const updatedPortfolio = [...card.portfolio, {
      title: newPortTitle.trim(),
      description: newPortDesc.trim(),
      image: newPortImg.trim() || undefined,
      link: newPortLink.trim() || undefined
    }];

    setCard({
      ...card,
      portfolio: updatedPortfolio
    });

    setNewPortTitle("");
    setNewPortDesc("");
    setNewPortImg("");
    setNewPortLink("");
  };

  const handleRemovePortfolioItem = (index: number) => {
    if (!card) return;
    const updatedPortfolio = card.portfolio.filter((_, idx) => idx !== index);
    setCard({
      ...card,
      portfolio: updatedPortfolio
    });
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (!card || !card.blocks) return;
    const newBlocks = [...card.blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    
    setCard({
      ...card,
      blocks: newBlocks
    });
  };

  const handleSave = async () => {
    if (!card) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card)
      });

      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
        alert("Digital Visiting Card saved and published successfully!");
      } else {
        const errData = await res.json();
        setError(errData.error || "Save operation failed.");
      }
    } catch (err) {
      console.error("Save card error:", err);
      setError("Error connecting to server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-gray-400">Loading your visiting card data...</p>
      </div>
    );
  }

  if (!card) return null;

  return (
    <div className="space-y-6">
      {/* Edit Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="p-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">Customize Visiting Card</h1>
            <p className="text-[10px] text-gray-400">Modify layouts, template identities, and block order in real-time.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile Preview toggle */}
          <button
            onClick={() => setShowMobilePreview(true)}
            className="flex sm:hidden items-center space-x-1 px-3 py-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-semibold rounded-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <a
            href={`/card/${card.uniqueCode || card.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Public</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold rounded-lg cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save & Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
          {error}
        </div>
      )}

      {/* Editor & Preview Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab Selection Bar - Sticky on Mobile for easy switching */}
          <div className="sticky top-16 z-30 flex overflow-x-auto bg-[#0b0f19]/90 border border-white/5 rounded-xl p-1.5 gap-1.5 scrollbar-none backdrop-blur-md shadow-lg shadow-black/30">
            {[
              { id: "basic", label: "Basic Info", icon: <User className="w-3.5 h-3.5" /> },
              { id: "contact", label: "Contact", icon: <Phone className="w-3.5 h-3.5" /> },
              { id: "social", label: "Social", icon: <Share2 className="w-3.5 h-3.5" /> },
              { id: "services", label: "Services", icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: "layout", label: "Layout", icon: <Layers className="w-3.5 h-3.5" /> },
              { id: "styling", label: "Visual Style", icon: <Palette className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content cards */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 min-h-[400px]">
            {/* 1. Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Basic Information</h3>
                
                {/* Photo Upload layout */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-4 border-b border-white/5">
                  <div className="relative w-20 h-20 rounded-full border border-white/10 overflow-hidden bg-black/40 shrink-0">
                    <img 
                      src={card.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(card.name)}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="w-4.5 h-4.5 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-grow text-center sm:text-left w-full">
                    <label className="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Avatar Portrait</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploading}
                      className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10 file:cursor-pointer disabled:opacity-50 w-full"
                    />
                    <p className="text-[9px] text-gray-500">Supports JPG, PNG or WebP. Square format recommended.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Secure Card Link (Unguessable URL)</label>
                    <div className="flex rounded-lg overflow-hidden border border-white/10 focus-within:border-primary/50 transition-colors bg-white/5">
                      <span className="px-3 py-2 text-xs text-gray-500 font-semibold select-none flex items-center">dravion.site/card/</span>
                      <input 
                        type="text" 
                        readOnly
                        value={card.uniqueCode || card.username}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                        className="grow px-3 py-2 text-xs bg-black/20 text-slate-300 focus:outline-none cursor-pointer select-all font-mono"
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 leading-normal">This is your secure, un-guessable dynamic card link designed to prevent random URL enumeration.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Personal Nickname URL</label>
                    <div className="flex rounded-lg overflow-hidden border border-white/10 focus-within:border-primary/50 transition-colors">
                      <span className="bg-white/5 px-3 py-2 text-xs text-gray-500 font-semibold select-none flex items-center">dravion.site/card/</span>
                      <input 
                        type="text" 
                        required
                        value={card.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                        className="grow px-3 py-2 text-xs bg-black/40 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={card.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 block">Job Title</label>
                      <input 
                        type="text" 
                        value={card.title || ""}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Company Name</label>
                    <input 
                      type="text" 
                      value={card.company || ""}
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Personal Bio</label>
                    <textarea 
                      rows={3}
                      value={card.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      placeholder="Share a short introduction about yourself..."
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Contact Channels</h3>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
                  Enter connection details. Clicking call action buttons on cards triggers local call operations.
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 555 123 4567"
                      value={card.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">WhatsApp Number (with country code)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. +919876543210"
                      value={card.whatsapp || ""}
                      onChange={(e) => handleChange("whatsapp", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="name@company.com"
                      value={card.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Website URL</label>
                    <input 
                      type="text" 
                      placeholder="https://company.com"
                      value={card.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 block">Physical Location / Address</label>
                    <input 
                      type="text" 
                      placeholder="City, Country"
                      value={card.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Social Tab */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white mb-4">Connected Networks</h3>
                <div className="space-y-3">
                  {[
                    { id: "instagram", label: "Instagram" },
                    { id: "linkedin", label: "LinkedIn" },
                    { id: "github", label: "GitHub" },
                    { id: "facebook", label: "Facebook" },
                    { id: "twitter", label: "Twitter / X" },
                    { id: "youtube", label: "YouTube" }
                  ].map((soc) => (
                    <div key={soc.id} className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 block">{soc.label}</label>
                      <input
                        type="text"
                        placeholder="username or full URL"
                        value={(card.socialLinks as any)[soc.id] || ""}
                        onChange={(e) => handleNestedChange("socialLinks", soc.id, e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Service List Items</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    List specific work items or solutions you perform. Each item contains description and links.
                  </p>
                </div>

                {/* Add Service Box */}
                <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Add New Service</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-gray-400 block">Service Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Website Development"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-gray-400 block">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. 5-page custom websites optimized for mobile screens."
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[9px] font-bold text-gray-400 block">Outbound Link (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. dravion.site/portfolio"
                        value={newServiceLink}
                        onChange={(e) => setNewServiceLink(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleAddService}
                      className="inline-flex items-center space-x-1 bg-primary hover:opacity-95 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Item</span>
                    </button>
                  </div>
                </div>

                {/* Display Current Services */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Current Services ({card.services.length})</span>
                  {card.services.length === 0 ? (
                    <p className="text-[10px] text-gray-500 italic">No services listed yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {card.services.map((srv, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg">
                          <div className="overflow-hidden pr-4 space-y-0.5">
                            <h4 className="text-xs font-bold text-white">{srv.name}</h4>
                            <p className="text-[10px] text-gray-400 truncate">{srv.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(idx)}
                            className="text-red-400 hover:text-red-500 p-1 bg-red-500/10 rounded border border-red-500/10 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. Portfolio Tab */}
            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Portfolio Showcase</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Showcase case studies, designs, or projects inside a visually prominent block.
                  </p>
                </div>

                {/* Add Portfolio Box */}
                <div className="bg-black/35 border border-white/5 p-4 rounded-xl space-y-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">Add Project Item</span>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 block">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Dravion Brand Identity"
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-400 block">Short Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Complete redesign of guidelines and vector brand assets."
                        value={newPortDesc}
                        onChange={(e) => setNewPortDesc(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 block">Image Link / URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/photo-..."
                          value={newPortImg}
                          onChange={(e) => setNewPortImg(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 block">Project Link / URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. https://dravion.site"
                          value={newPortLink}
                          onChange={(e) => setNewPortLink(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs bg-black/40 border border-white/10 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleAddPortfolioItem}
                      className="inline-flex items-center space-x-1 bg-primary hover:opacity-95 text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Project</span>
                    </button>
                  </div>
                </div>

                {/* Display Current Items */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Current Portfolio Items ({(card.portfolio || []).length})</span>
                  {(card.portfolio || []).length === 0 ? (
                    <p className="text-[10px] text-gray-500 italic">No portfolio items added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {card.portfolio.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/5 p-3 rounded-lg">
                          <div className="flex items-center space-x-3 overflow-hidden pr-4">
                            {item.image && (
                              <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                            )}
                            <div className="overflow-hidden space-y-0.5">
                              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                              <p className="text-[10px] text-gray-400 truncate">{item.description}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemovePortfolioItem(idx)}
                            className="text-red-400 hover:text-red-500 p-1 bg-red-500/10 rounded border border-red-500/10 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. Layout Block ordering Tab */}
            {activeTab === "layout" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-white">Layout block builder</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    Arrange the visual hierarchy. Shift layouts dynamically to emphasize different blocks.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {(card.blocks || []).filter(b => b !== "portfolio").map((blockId, idx) => {
                    const blockLabels: Record<string, string> = {
                      profile: "1. Avatar & Hero Banner Info",
                      about: "2. Personal Summary (Bio)",
                      contact: "3. Direct Contact Actions",
                      socialLinks: "4. Connected Social Networks",
                      services: "5. Capabilities / Service list",
                      qrcode: "6. Sharing QR Scan Box"
                    };

                    return (
                      <div 
                        key={blockId} 
                        className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-xl hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          <Layers className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-xs font-bold text-white">{blockLabels[blockId] || blockId}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveBlock(idx, "up")}
                            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === (card.blocks || []).length - 1}
                            onClick={() => moveBlock(idx, "down")}
                            className="p-1.5 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 7. Custom Visual Style Tab */}
            {activeTab === "styling" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Visual Themes</h3>
                  <p className="text-[11px] text-gray-400">Choose from 6 layout templates representing different aesthetics.</p>
                </div>

                {/* Style Personality recommendation */}
                <div className="space-y-2 pb-4 border-b border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Recommended Style Personality</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "luxury", label: "Luxury", template: "obsidian", color: "#d4af37", font: "font-serif", bg: "solid", themeMode: "dark" },
                      { id: "creative", label: "Creative", template: "aurora", color: "#a855f7", font: "font-sans", bg: "aurora", themeMode: "dark" },
                      { id: "corporate", label: "Professional", template: "swiss", color: "#000000", font: "font-sans", bg: "grid", themeMode: "light" },
                      { id: "tech", label: "Futuristic", template: "glass", color: "#06b6d4", font: "font-mono", bg: "stripes", themeMode: "dark" },
                      { id: "creator", label: "Creator", template: "creator", color: "#ec4899", font: "font-display", bg: "dots", themeMode: "dark" }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => {
                          setCard({
                            ...card,
                            template: style.template as any,
                            customization: {
                              accentColor: style.color,
                              fontStyle: style.font,
                              backgroundStyle: style.bg,
                              profileShape: style.id === "luxury" ? "square" : "circle",
                              buttonStyle: style.id === "luxury" ? "square" : (style.id === "creative" ? "pill" : "rounded"),
                              themeMode: style.themeMode as any
                            }
                          });
                        }}
                        className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300 hover:bg-primary/20 hover:border-primary transition-all cursor-pointer"
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "obsidian", label: "Obsidian", desc: "Luxury, dark base, elegant serif layout." },
                    { id: "aurora", label: "Aurora", desc: "Creative glowing tech meshes." },
                    { id: "swiss", label: "Swiss", desc: "Minimal editorial-style corporate layouts." },
                    { id: "glass", label: "Glass", desc: "Cyber glass depth overlays." },
                    { id: "creator", label: "Creator", desc: "Visual-first visual gallery layout." },
                    { id: "corporate", label: "Corporate", desc: "Structured employee/company columns." }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      type="button"
                      onClick={() => handleChange("template", temp.id as any)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        card.template === temp.id
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                          : "bg-black/20 border-white/5 hover:border-white/10"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-white mb-1">{temp.label}</h4>
                      <p className="text-[9px] text-gray-400 leading-normal">{temp.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Theme Mode selector */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Theme Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "dark", label: "Dark Theme", desc: "Sleek, low-light backdrop" },
                      { id: "light", label: "Light Theme", desc: "Clean, high-contrast backdrop" }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => handleNestedChange("customization", "themeMode", mode.id)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                          card.customization.themeMode === mode.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                            : "bg-black/20 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-xs font-bold text-white mb-0.5">{mode.label}</h4>
                        <p className="text-[9px] text-gray-400 leading-normal">{mode.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors picker */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Accent Brand Color</label>
                  <div className="flex flex-wrap gap-2.5">
                    {themeColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => handleNestedChange("customization", "accentColor", color.hex)}
                        title={color.name}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
                          card.customization.accentColor === color.hex
                            ? "border-white"
                            : "border-transparent"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {card.customization.accentColor === color.hex && (
                          <Check className={`w-3.5 h-3.5 ${color.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Typography selector */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Typography Font</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "font-sans", label: "Sans-Serif", desc: "Outfit / Inter (Clean & modern)" },
                      { id: "font-serif", label: "Serif", desc: "Lora / Playfair (Elegant & classic)" },
                      { id: "font-mono", label: "Monospace", desc: "Fira / JetBrains (Tech & structured)" },
                      { id: "font-display", label: "Display", desc: "Bold Upper (Impactful & clean)" }
                    ].map((font) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => handleNestedChange("customization", "fontStyle", font.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          card.customization.fontStyle === font.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                            : "bg-black/20 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-[11px] font-bold text-white mb-0.5">{font.label}</h4>
                        <p className="text-[8px] text-gray-400 leading-normal">{font.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Pattern selector */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Background Pattern</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "grid", label: "Accent Grid", desc: "Faint grid lines tinted to match your brand." },
                      { id: "dots", label: "Accent Dots", desc: "Minimal dotted pattern in brand color." },
                      { id: "aurora", label: "Vibrant Aurora", desc: "Soft ambient gradients of your theme." },
                      { id: "stripes", label: "Diagonal Stripes", desc: "Elegant diagonal branding lines." },
                      { id: "solid", label: "Solid Color", desc: "No pattern, clean and flat background." }
                    ].map((pat) => (
                      <button
                        key={pat.id}
                        type="button"
                        onClick={() => handleNestedChange("customization", "backgroundStyle", pat.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                          card.customization.backgroundStyle === pat.id
                            ? "bg-primary/10 border-primary shadow-lg shadow-primary/5"
                            : "bg-black/20 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <h4 className="text-[11px] font-bold text-white mb-0.5">{pat.label}</h4>
                        <p className="text-[8px] text-gray-400 leading-normal">{pat.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile shape selector */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Profile Photo Shape</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "circle", label: "Circular" },
                      { id: "rounded", label: "Rounded" },
                      { id: "square", label: "Sharp" }
                    ].map((shape) => (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => handleNestedChange("customization", "profileShape", shape.id)}
                        className={`py-2 px-3 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          card.customization.profileShape === shape.id
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-black/20 border-white/5 text-gray-400 hover:border-white/10"
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Button style selector */}
                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Action Buttons Border</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "square", label: "Square" },
                      { id: "rounded", label: "Rounded" },
                      { id: "pill", label: "Pill Shape" }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => handleNestedChange("customization", "buttonStyle", btn.id)}
                        className={`py-2 px-3 text-center rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                          card.customization.buttonStyle === btn.id
                            ? "bg-primary/10 border-primary text-white"
                            : "bg-black/20 border-white/5 text-gray-400 hover:border-white/10"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side (Sticky simulated preview 5 cols) */}
        <div className="lg:col-span-5 sticky top-24 hidden lg:block font-sans">
          <div className="text-center mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Live Preview Mockup</span>
          </div>

          <div className="flex justify-center">
            {/* Phone Screen Mockup */}
            <div className="w-72 h-[500px] bg-slate-950 border-[7px] border-slate-800 rounded-[36px] overflow-hidden shadow-2xl relative">
              <div className="w-24 h-4 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>
              {/* Inner card rendering */}
              <div className="h-full overflow-y-auto pt-6 scrollbar-none">
                <CardTemplate data={card as any} hideBranding={false} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview Modal */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4 md:hidden">
          <div className="absolute inset-0" onClick={() => setShowMobilePreview(false)}></div>
          <div className="relative z-10 w-72 h-[480px] bg-slate-950 border-[6px] border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="w-20 h-4 bg-slate-800 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-20"></div>
            <button
              onClick={() => setShowMobilePreview(false)}
              className="absolute top-6 right-6 bg-black/60 text-white rounded-full p-1.5 z-30 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="h-full overflow-y-auto pt-6 scrollbar-none">
              <CardTemplate data={card as any} hideBranding={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Mobile Modal close icon
function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
