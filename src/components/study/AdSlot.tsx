import React from "react";

interface AdSlotProps {
  position: "study-home" | "subject-page" | "chapter-page" | "dashboard" | "pdf-bottom" | "pdf-top" | "mobile-banner";
  className?: string;
  adClient?: string;
  adSlotId?: string;
}

/**
 * Reusable monetization & advertisement slot component for Dravion Study.
 * Formatted for optimal visibility on both mobile devices and laptop screens.
 */
export default function AdSlot({
  position,
  className = "",
  adClient,
  adSlotId,
}: AdSlotProps) {
  const isDev = process.env.NODE_ENV === "development";

  // If live ad details are provided, render Google AdSense / Ad unit script tag container
  if (adClient && adSlotId) {
    return (
      <div
        data-ad-position={position}
        className={`w-full flex justify-center items-center my-4 overflow-hidden ${className}`}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={adClient}
          data-ad-slot={adSlotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      data-ad-position={position}
      className={`w-full bg-slate-100/90 border border-dashed border-slate-300 rounded-xl p-3 sm:p-4 text-center my-4 select-none shadow-xs transition-all ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-200/80 border border-slate-300 px-2.5 py-0.5 rounded-full">
          ADVERTISEMENT SPACE • MOBILE & DESKTOP
        </span>
        <p className="text-xs font-semibold text-slate-600">
          Ad Slot ({position}) — Ready for Google AdSense / Sponsor Banners
        </p>
      </div>
    </div>
  );
}
