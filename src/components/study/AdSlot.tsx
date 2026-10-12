"use client";

import React, { useEffect, useRef } from "react";

interface AdSlotProps {
  position: "study-home" | "subject-page" | "chapter-page" | "dashboard" | "pdf-bottom" | "pdf-top" | "mobile-banner";
  className?: string;
  adClient?: string;
  adSlotId?: string;
}

/**
 * Official Google AdSense Ad Unit for Dravion Study.
 * Configured with publisher ca-pub-1988525992738589 and slot 9466776499.
 */
export default function AdSlot({
  position,
  className = "",
  adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-1988525992738589",
  adSlotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT || "9466776499",
}: AdSlotProps) {
  const adPushed = useRef<boolean>(false);

  useEffect(() => {
    if (adPushed.current) return;

    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adPushed.current = true;
      }
    } catch (err) {
      console.warn("[AdSense Error]:", err);
    }
  }, []);

  return (
    <div
      data-ad-position={position}
      className={`w-full flex justify-center items-center my-4 overflow-hidden min-h-[90px] ${className}`}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%", minHeight: "90px" }}
        data-ad-client={adClient}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

