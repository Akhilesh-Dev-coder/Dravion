"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Link as LinkIcon, Check, QrCode, Share2, Sparkles, Image as ImageIcon } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  cardName: string;
  profileImage?: string;
}

export default function QRModal({ isOpen, onClose, username, cardName, profileImage }: QRModalProps) {
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrStyle, setQrStyle] = useState<"standard" | "profile" | "dravion">("standard");

  const cardLink = `${
    typeof window !== "undefined" 
      ? window.location.origin 
      : "https://dravion.site"
  }/card/${username}`;

  const drawFallbackInitials = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, size: number) => {
    ctx.fillStyle = "#6366f1";
    ctx.beginPath();
    ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const initials = cardName
      ? cardName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
      : "QR";
    ctx.fillText(initials, centerX, centerY);
  };

  useEffect(() => {
    if (isOpen && username) {
      const canvas = document.createElement("canvas");
      
      QRCode.toCanvas(
        canvas,
        cardLink,
        {
          width: 380,
          margin: 1.5,
          errorCorrectionLevel: "H", // High level is critical for scannability with central overlays
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        },
        (err) => {
          if (err) {
            console.error("Error generating QR:", err);
            return;
          }

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const size = canvas.width;
          const centerX = size / 2;
          const centerY = size / 2;
          const logoSize = 64; // size of overlay logo

          if (qrStyle === "profile") {
            // White mask backing
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(centerX, centerY, logoSize / 2 + 5, 0, Math.PI * 2);
            ctx.fill();

            if (profileImage) {
              const img = new Image();
              img.crossOrigin = "anonymous";
              img.src = profileImage;
              img.onload = () => {
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(img, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize);
                ctx.restore();

                // Border ring
                ctx.strokeStyle = "#e2e8f0";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(centerX, centerY, logoSize / 2, 0, Math.PI * 2);
                ctx.stroke();

                setQrUrl(canvas.toDataURL("image/png"));
              };
              img.onerror = () => {
                drawFallbackInitials(ctx, centerX, centerY, logoSize);
                setQrUrl(canvas.toDataURL("image/png"));
              };
            } else {
              drawFallbackInitials(ctx, centerX, centerY, logoSize);
              setQrUrl(canvas.toDataURL("image/png"));
            }
          } else if (qrStyle === "dravion") {
            // White mask backing
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(centerX, centerY, logoSize / 2 + 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw professional glowing Starburst
            ctx.fillStyle = "#6366f1";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - logoSize / 2.2);
            ctx.quadraticCurveTo(centerX, centerY, centerX + logoSize / 2.2, centerY);
            ctx.quadraticCurveTo(centerX, centerY, centerX, centerY + logoSize / 2.2);
            ctx.quadraticCurveTo(centerX, centerY, centerX - logoSize / 2.2, centerY);
            ctx.quadraticCurveTo(centerX, centerY, centerX, centerY - logoSize / 2.2);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#06b6d4";
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - logoSize / 5);
            ctx.quadraticCurveTo(centerX, centerY, centerX + logoSize / 5, centerY);
            ctx.quadraticCurveTo(centerX, centerY, centerX, centerY + logoSize / 5);
            ctx.quadraticCurveTo(centerX, centerY, centerX - logoSize / 5, centerY);
            ctx.quadraticCurveTo(centerX, centerY, centerX, centerY - logoSize / 5);
            ctx.closePath();
            ctx.fill();

            setQrUrl(canvas.toDataURL("image/png"));
          } else {
            // Standard plain QR
            setQrUrl(canvas.toDataURL("image/png"));
          }
        }
      );
    }
  }, [isOpen, username, cardLink, qrStyle, profileImage]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `dravion-qr-${username}-${qrStyle}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cardName}'s Digital Visiting Card`,
          text: `Check out ${cardName}'s professional visiting card on Dravion.`,
          url: cardLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="glass-panel-premium w-full max-w-sm rounded-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200 text-center space-y-5">
        <div className="flex justify-between items-center pb-2 border-b border-white/5">
          <h3 className="text-sm font-bold text-white flex items-center">
            <QrCode className="w-4.5 h-4.5 mr-2 text-primary" /> Share Visiting Card
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Graphic wrapper */}
        <div className="bg-white p-3 rounded-xl inline-block border border-white/10 shadow-lg">
          {qrUrl ? (
            <img src={qrUrl} alt="Card QR Code" className="w-52 h-52 mx-auto" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-gray-500 font-medium text-xs">
              Generating Code...
            </div>
          )}
        </div>

        {/* Style Customizer Panel */}
        <div className="space-y-1.5 text-left">
          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">QR Code Customization</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "standard", label: "Standard", icon: <QrCode className="w-3.5 h-3.5" /> },
              { id: "profile", label: "Profile", icon: <ImageIcon className="w-3.5 h-3.5" /> },
              { id: "dravion", label: "Dravion Logo", icon: <Sparkles className="w-3.5 h-3.5" /> }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setQrStyle(style.id as any)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[9px] font-bold tracking-tight transition-all cursor-pointer ${
                  qrStyle === style.id
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/5 text-gray-400 hover:border-white/10"
                }`}
              >
                <span className="mb-1">{style.icon}</span>
                <span>{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-white">{cardName}</h4>
          <p className="text-[9px] text-primary truncate max-w-xs mx-auto">{cardLink}</p>
        </div>

        {/* Action button Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center space-x-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-2 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            disabled={!qrUrl}
            className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-medium py-2 rounded-lg text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download QR</span>
          </button>
        </div>

        {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center space-x-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Native Share Options</span>
          </button>
        )}
      </div>
    </div>
  );
}
