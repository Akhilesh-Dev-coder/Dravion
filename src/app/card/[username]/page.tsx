import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";
import PublicCardClient from "./PublicCardClient";

interface CardPageProps {
  params: Promise<{ username: string }>;
}

// Generate dynamic SEO metadata server-side
export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  const { username } = await params;
  
  try {
    await dbConnect();
    const card = await Card.findOne({
      $or: [
        { uniqueCode: username },
        { username: username.toLowerCase().trim() }
      ],
      isPublic: true
    });
    
    if (!card) {
      return {
        title: "Card Not Found | Dravion",
        description: "The digital visiting card you are trying to access does not exist or has been privatized."
      };
    }

    const titleText = `${card.name} | ${card.title || "Professional"} | Dravion`;
    const descText = `Connect with ${card.name}${card.company ? ` at ${card.company}` : ""}. View phone number, WhatsApp chat, and social profile links.`;
    
    return {
      title: titleText,
      description: descText,
      openGraph: {
        title: titleText,
        description: descText,
        url: `https://dravion.site/card/${username}`,
        type: "profile",
        images: card.profileImage ? [{ url: card.profileImage }] : []
      },
      twitter: {
        card: "summary_large_image",
        title: titleText,
        description: descText,
        images: card.profileImage ? [card.profileImage] : []
      }
    };
  } catch (err) {
    return {
      title: "Dravion Digital Card"
    };
  }
}

export default async function CardPage({ params }: CardPageProps) {
  const { username } = await params;
  
  await dbConnect();
  const card = await Card.findOne({
    $or: [
      { uniqueCode: username },
      { username: username.toLowerCase().trim() }
    ],
    isPublic: true
  });

  if (card && !card.uniqueCode) {
    let uniqueCode = "";
    let isUnique = false;
    while (!isUnique) {
      uniqueCode = Math.random().toString(36).substring(2, 8);
      const dup = await Card.findOne({ uniqueCode });
      if (!dup) isUnique = true;
    }
    card.uniqueCode = uniqueCode;
    await card.save();
  }

  if (!card) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#030712] px-4 bg-grid-pattern text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="glass-panel-premium max-w-md rounded-2xl p-8 border border-white/5 space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-primary">
            <HelpCircle className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Digital Card Not Found</h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              The card you are trying to visit at <span className="text-primary font-bold">/card/{username}</span> is inactive, does not exist, or has been disabled.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center space-x-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-all"
            >
              <span>Create Your Free Card</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Cast model data to plain object for client-side serialization compatibility
  const serializedCard = {
    _id: card._id.toString(),
    username: card.username,
    uniqueCode: card.uniqueCode || card.username,
    name: card.name,
    title: card.title,
    company: card.company,
    bio: card.bio,
    profileImage: card.profileImage,
    phone: card.phone,
    whatsapp: card.whatsapp,
    email: card.email,
    website: card.website,
    location: card.location,
    socialLinks: card.socialLinks ? JSON.parse(JSON.stringify(card.socialLinks)) : {},
    services: card.services ? JSON.parse(JSON.stringify(card.services)) : [],
    template: card.template,
    customization: {
      accentColor: card.customization?.accentColor || "#6366f1",
      fontStyle: card.customization?.fontStyle || "font-sans",
      backgroundStyle: card.customization?.backgroundStyle || "grid",
      profileShape: card.customization?.profileShape || "circle",
      buttonStyle: card.customization?.buttonStyle || "rounded",
      themeMode: card.customization?.themeMode || "dark"
    }
  };

  return <PublicCardClient card={serializedCard as any} />;
}
