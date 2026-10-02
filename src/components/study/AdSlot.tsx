import React from "react";

interface AdSlotProps {
  position: "study-home" | "subject-page" | "chapter-page" | "dashboard" | "pdf-bottom";
  className?: string;
}

/**
 * Reusable monetization placeholder for Dravion Study.
 * Does not display intrusive fake ads; renders a clean, subtle placeholder in dev mode
 * or empty container ready for Google AdSense / Ad network script injection later.
 */
export default function AdSlot({ position, className = "" }: AdSlotProps) {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    // In production (until ad network is enabled), return null or empty slot wrapper
    return <div data-ad-position={position} className={className} />;
  }

  return (
    <div
      data-ad-position={position}
      className={`border border-dashed border-white/10 bg-black/20 rounded-lg p-3 text-center text-xs text-gray-500 my-4 select-none ${className}`}
    >
      <span className="font-mono uppercase tracking-wider text-[10px] text-gray-400">
        Ad Space ({position})
      </span>
    </div>
  );
}
