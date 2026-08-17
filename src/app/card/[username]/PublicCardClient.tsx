"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
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
}

export default function PublicCardClient({ card }: { card: ICardData }) {
  const searchParams = useSearchParams();
  const lastLoggedRef = useRef<string | null>(null);

  useEffect(() => {
    const key = `${card._id}-${searchParams.get("src") || ""}-${searchParams.get("ref") || ""}`;
    if (lastLoggedRef.current === key) return;
    lastLoggedRef.current = key;

    const logPageView = async () => {
      try {
        const isQR = searchParams.get("src") === "qr" || searchParams.get("ref") === "qr";
        const eventType = isQR ? "qr_scan" : "view";

        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: card._id,
            eventType,
            metadata: {
              referrer: typeof document !== "undefined" ? document.referrer : ""
            }
          })
        });
      } catch (err) {
        console.error("Failed to log page view analytics:", err);
      }
    };

    logPageView();
  }, [card._id, searchParams]);

  const handleLinkClick = async (type: "whatsapp" | "phone" | "email" | "website" | "social_click") => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card._id,
          eventType: type
        })
      });
    } catch (err) {
      console.error(`Failed to log ${type} click analytics:`, err);
    }
  };

  // Provide defaults for newer blocks/portfolio/customization arrays just in case they're absent on older objects
  const hydratedCard = {
    ...card,
    socialLinks: card.socialLinks || {},
    services: card.services || [],
    portfolio: card.portfolio || [],
    blocks: card.blocks && card.blocks.length > 0 ? card.blocks : ["profile", "about", "contact", "socialLinks", "services", "qrcode"],
    customization: {
      accentColor: card.customization?.accentColor || "#6366f1",
      fontStyle: card.customization?.fontStyle || "font-sans",
      backgroundStyle: card.customization?.backgroundStyle || "grid",
      profileShape: card.customization?.profileShape || "circle",
      buttonStyle: card.customization?.buttonStyle || "rounded",
      themeMode: card.customization?.themeMode || "dark",
    }
  };

  const isLight = hydratedCard.customization.themeMode === "light";

  return (
    <main 
      className={`min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden transition-colors ${
        isLight ? "bg-[#ececed]" : "bg-[#030712]"
      }`}
    >
      {/* Background radial orbs */}
      {!isLight && (
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40"
          style={{ backgroundColor: hydratedCard.customization.accentColor }}
        ></div>
      )}
      
      {/* Target card device wrapper */}
      <div 
        className={`w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 min-h-[560px] border flex flex-col ${
          isLight ? "border-black/10 bg-[#f4f4f6]" : "border-white/5 bg-[#0b0f19]"
        }`}
      >
        <CardTemplate data={hydratedCard} onLinkClick={handleLinkClick} />
      </div>
    </main>
  );
}
