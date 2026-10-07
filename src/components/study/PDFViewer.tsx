"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Download,
  Bookmark,
  Maximize2,
  Minimize2,
  Share2,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
  AlertCircle,
  Smartphone,
  BookOpen,
  ArrowLeftRight,
  Sparkles,
  X,
  Sliders,
  Eye,
  ArrowUp,
  Layers,
} from "lucide-react";

interface PDFViewerProps {
  materialId: string;
  fileUrl: string;
  notebookLmUrl?: string;
  title: string;
  initialPage?: number;
  totalPages?: number;
  downloadCount?: number;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  onPageChange?: (page: number) => void;
  onDownload?: () => void;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function PDFViewer({
  materialId,
  fileUrl,
  notebookLmUrl,
  title,
  initialPage = 1,
  downloadCount = 0,
  isBookmarked = false,
  onBookmarkToggle,
  onPageChange,
  onDownload,
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isImmersive, setIsImmersive] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<"scroll" | "swipe">("scroll");
  const [showControls, setShowControls] = useState<boolean>(true);

  // Touch Swipe Gesture State (Mobile Swipe Mode)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);
  const pageCanvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});
  const pdfDocRef = useRef<any>(null);
  const renderTasksRef = useRef<{ [key: number]: any }>({});

  const proxyUrl = `/api/study/pdf-proxy?url=${encodeURIComponent(fileUrl)}`;

  // Detect Mobile Screen vs Desktop
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when immersive mode is open
  useEffect(() => {
    if (isImmersive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isImmersive]);

  // Load PDF.js engine and document
  useEffect(() => {
    let isSubscribed = true;

    const initPdfEngine = async () => {
      setLoading(true);
      setError(null);

      // 1. Load local PDF.js script if not available
      if (!window.pdfjsLib) {
        try {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "/pdfjs/pdf.min.js";
            script.onload = () => {
              if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
                resolve();
              } else {
                reject(new Error("PDF.js local script failed to initialize"));
              }
            };
            script.onerror = () => reject(new Error("Failed to load local /pdfjs/pdf.min.js script"));
            document.body.appendChild(script);
          });
        } catch (err: any) {
          if (isSubscribed) {
            setError("Could not load PDF engine. Tap Open PDF to view directly.");
            setLoading(false);
          }
          return;
        }
      } else {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";
      }

      // 2. Fetch PDF binary data as ArrayBuffer to bypass worker CORS & network issues on mobile/LAN
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF binary stream: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        if (!isSubscribed) return;

        const loadingTask = window.pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;
        if (!isSubscribed) return;

        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setLoading(false);

        // Auto calculate optimal fit-to-width scale
        if (containerRef.current) {
          const firstPage = await pdf.getPage(1);
          const unscaledViewport = firstPage.getViewport({ scale: 1.0 });
          const containerWidth = (containerRef.current.clientWidth || window.innerWidth) - (isMobile ? 24 : 48);
          if (containerWidth > 0 && unscaledViewport.width > 0) {
            const fitScale = Math.min(2.5, Math.max(0.7, containerWidth / unscaledViewport.width));
            setScale(fitScale);
          }
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        console.error("[PDF ArrayBuffer Load Error]:", err);
        setError("Unable to render PDF preview inside browser. Tap Open PDF to view directly.");
        setLoading(false);
      }
    };

    initPdfEngine();

    return () => {
      isSubscribed = false;
    };
  }, [fileUrl, proxyUrl, isMobile]);

  // Helper function to render a single PDF page to a canvas element
  const renderSinglePageCanvas = useCallback(
    async (pageNumber: number, canvas: HTMLCanvasElement) => {
      if (!pdfDocRef.current || !canvas) return;

      try {
        if (renderTasksRef.current[pageNumber]) {
          renderTasksRef.current[pageNumber].cancel();
        }

        const page = await pdfDocRef.current.getPage(pageNumber);
        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale });
        const outputScale = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        const renderTask = page.render(renderContext);
        renderTasksRef.current[pageNumber] = renderTask;
        await renderTask.promise;
      } catch (err: any) {
        if (err.name !== "RenderingCancelledException") {
          console.error(`Page ${pageNumber} render error`, err);
        }
      }
    },
    [scale]
  );

  // Render Mobile Single Page (Swipe Mode)
  useEffect(() => {
    if (isMobile && mobileViewMode === "swipe" && singleCanvasRef.current && !loading && pdfDocRef.current) {
      renderSinglePageCanvas(currentPage, singleCanvasRef.current);
    }
  }, [isMobile, mobileViewMode, currentPage, scale, loading, renderSinglePageCanvas]);

  // Render Continuous Vertical Scroll (All Pages) for Desktop or Mobile Scroll Mode
  useEffect(() => {
    if ((!isMobile || mobileViewMode === "scroll") && !loading && pdfDocRef.current) {
      for (let p = 1; p <= totalPages; p++) {
        const canvas = pageCanvasRefs.current[p];
        if (canvas) {
          renderSinglePageCanvas(p, canvas);
        }
      }
    }
  }, [isMobile, mobileViewMode, totalPages, scale, loading, renderSinglePageCanvas]);

  // Handle Vertical Scroll Active Page Detection
  const handleScroll = () => {
    if ((isMobile && mobileViewMode === "swipe") || !scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerTop = container.scrollTop;

    for (let p = 1; p <= totalPages; p++) {
      const canvas = pageCanvasRefs.current[p];
      if (canvas) {
        const offsetTop = canvas.offsetTop - 120;
        const offsetBottom = offsetTop + canvas.clientHeight;
        if (containerTop >= offsetTop && containerTop < offsetBottom) {
          if (currentPage !== p) {
            setCurrentPage(p);
            if (onPageChange) onPageChange(p);
          }
          break;
        }
      }
    }
  };

  // Touch Swipe Page Flip Handlers (Mobile Swipe Mode)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || mobileViewMode !== "swipe") return;
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || mobileViewMode !== "swipe" || touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX;
    setTouchEndX(currentX);
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isMobile || mobileViewMode !== "swipe" || touchStartX === null || touchEndX === null) {
      setDragOffset(0);
      return;
    }

    const distance = touchEndX - touchStartX;
    const minSwipeDistance = 45;

    if (distance < -minSwipeDistance && currentPage < totalPages) {
      setIsFlipping(true);
      setTimeout(() => {
        handlePageChange(currentPage + 1);
        setIsFlipping(false);
        setDragOffset(0);
      }, 150);
    } else if (distance > minSwipeDistance && currentPage > 1) {
      setIsFlipping(true);
      setTimeout(() => {
        handlePageChange(currentPage - 1);
        setIsFlipping(false);
        setDragOffset(0);
      }, 150);
    } else {
      setDragOffset(0);
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    if (onPageChange) {
      onPageChange(validPage);
    }

    // Scroll smoothly to target page canvas if in scroll mode
    if (pageCanvasRefs.current[validPage] && (mobileViewMode === "scroll" || !isMobile)) {
      pageCanvasRefs.current[validPage]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const resetToFitWidth = () => {
    if (!containerRef.current || !pdfDocRef.current) {
      setScale(isMobile ? 1.0 : 1.2);
      return;
    }
    pdfDocRef.current.getPage(1).then((page: any) => {
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = (containerRef.current?.clientWidth || window.innerWidth) - (isMobile ? 24 : 48);
      if (containerWidth > 0 && unscaledViewport.width > 0) {
        const fitScale = Math.min(2.5, Math.max(0.6, containerWidth / unscaledViewport.width));
        setScale(fitScale);
      }
    }).catch(() => setScale(isMobile ? 1.0 : 1.2));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${title} - Dravion Study`,
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* IMMERSIVE FULLSCREEN MOBILE STUDY MODE OVERLAY */}
      {isImmersive && (
        <div className="fixed inset-0 z-50 bg-[#08090d] flex flex-col w-screen h-screen overflow-hidden select-none animate-in fade-in duration-200">
          {/* Immersive Mobile Top Header */}
          <div className="flex items-center justify-between px-3.5 py-3 bg-[#11141c]/90 backdrop-blur-md border-b border-white/10 text-white z-20 shrink-0 shadow-lg">
            <div className="flex items-center space-x-2.5 min-w-0">
              <button
                onClick={() => setIsImmersive(false)}
                className="p-2 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl transition-all cursor-pointer"
                title="Exit Immersive Study Mode"
              >
                <X className="w-5 h-5 text-gray-200" />
              </button>
              <div className="truncate min-w-0">
                <h3 className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[180px] sm:max-w-md">
                  {title}
                </h3>
                <p className="text-[10px] text-blue-400 font-medium">
                  Immersive Mobile Study Mode • Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* Top Right Action Icons */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {onBookmarkToggle && (
                <button
                  onClick={onBookmarkToggle}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isBookmarked
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                  title="Bookmark Page"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-400" : ""}`} />
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl transition-colors cursor-pointer"
                title="Share Document"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <a
                href={proxyUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Immersive Reading Body */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-grow bg-[#090b10] overflow-auto flex flex-col items-center p-2 sm:p-4 touch-pan-y relative"
          >
            {loading ? (
              <div className="m-auto text-center p-8 text-gray-400 space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
                <p className="text-xs font-semibold text-gray-300">Preparing Immersive Canvas...</p>
              </div>
            ) : error ? (
              <div className="m-auto p-6 text-center bg-[#141720] border border-white/10 rounded-2xl max-w-md space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-xs text-gray-300">{error}</p>
                <a
                  href={proxyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs"
                >
                  Open Direct PDF
                </a>
              </div>
            ) : mobileViewMode === "swipe" ? (
              /* Swipe Mode inside Immersive */
              <div
                className="w-full flex-grow flex flex-col items-center justify-center relative touch-pan-y my-auto"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className={`transition-transform duration-200 ease-out flex flex-col items-center justify-center ${
                    isFlipping ? "scale-95 opacity-50" : ""
                  }`}
                  style={{
                    transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)`,
                  }}
                >
                  <canvas
                    ref={singleCanvasRef}
                    className="rounded-xl shadow-2xl border border-white/15 bg-white max-w-full"
                  />
                </div>
              </div>
            ) : (
              /* Continuous Scroll Mode inside Immersive */
              <div className="flex flex-col items-center space-y-4 w-full py-2 pb-32">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <div key={pageNum} className="flex flex-col items-center relative group w-full max-w-full">
                    <div className="mb-1 text-[10px] text-gray-400 font-mono flex items-center space-x-2">
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        Page {pageNum} / {totalPages}
                      </span>
                    </div>
                    <canvas
                      ref={(el) => {
                        pageCanvasRefs.current[pageNum] = el;
                      }}
                      className="rounded-xl shadow-2xl border border-white/15 bg-white max-w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Immersive Mobile Floating Control Dock */}
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-md bg-[#121622]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-2xl z-30 flex flex-col space-y-2.5">
            {/* Quick Page Jump Slider */}
            <div className="flex items-center space-x-3 px-1">
              <span className="text-[11px] font-mono font-bold text-blue-400 min-w-[42px]">
                {currentPage} / {totalPages}
              </span>
              <input
                type="range"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
              />
              <button
                onClick={scrollToTop}
                className="p-1 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg transition-colors shrink-0"
                title="Scroll to Top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bottom Dock Control Buttons */}
            <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/10 text-xs">
              {/* Previous / Next buttons */}
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-200 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-white font-mono px-1">
                  P.{currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-gray-200 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* View Mode Toggle: Scroll vs Swipe */}
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setMobileViewMode("scroll")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    mobileViewMode === "scroll"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Continuous Scroll Mode"
                >
                  Scroll
                </button>
                <button
                  onClick={() => setMobileViewMode("swipe")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    mobileViewMode === "swipe"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Single Page Flip Mode"
                >
                  Flip
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setScale(Math.max(0.5, scale - 0.15))}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-300 cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={resetToFitWidth}
                  className="text-[10px] font-mono text-gray-300 font-bold px-1 hover:text-white cursor-pointer"
                  title="Fit to Mobile Screen Width"
                >
                  {Math.round(scale * 100)}%
                </button>
                <button
                  onClick={() => setScale(Math.min(2.5, scale + 0.15))}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-300 cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STANDARD MAIN EMBEDDED PDF VIEWER CARD */}
      <div
        ref={containerRef}
        className={`flex flex-col bg-[#12151c] border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all ${
          isFullscreen ? "fixed inset-0 z-50 rounded-none border-none h-screen" : "w-full"
        }`}
      >
        {/* Top Control Header Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 px-3 sm:px-4 py-2.5 bg-[#181c24] border-b border-white/10">
          {/* Left: Title & Page Count */}
          <div className="flex items-center justify-between md:justify-start space-x-2.5 min-w-0 w-full md:w-auto">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="p-1.5 sm:p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="truncate">
                <h3 className="text-xs sm:text-sm font-semibold text-white truncate max-w-[150px] sm:max-w-xs">
                  {title}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">
                  Page <strong className="text-white">{currentPage}</strong> of {totalPages || "?"} • {downloadCount} downloads
                </p>
              </div>
            </div>

            {/* Mobile Immersive Reader Trigger Button (Prominent on small screens) */}
            <button
              onClick={() => setIsImmersive(true)}
              className="flex md:hidden items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0 border border-blue-400/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Study Mode</span>
            </button>
          </div>

          {/* Center & Right Toolbar */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
            {/* View Mode Toggle (Mobile / Tablet) */}
            {isMobile && (
              <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs shrink-0">
                <button
                  onClick={() => setMobileViewMode("scroll")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    mobileViewMode === "scroll"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Scroll
                </button>
                <button
                  onClick={() => setMobileViewMode("swipe")}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    mobileViewMode === "swipe"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Flip
                </button>
              </div>
            )}

            {/* Page Navigation & In-Viewer Zoom */}
            <div className="flex items-center space-x-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs shrink-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 disabled:opacity-30 cursor-pointer transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <div className="flex items-center space-x-0.5 sm:space-x-1 px-1 text-[11px] sm:text-xs">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-8 sm:w-9 text-center bg-black/50 border border-white/10 rounded text-white py-0.5 text-[11px] sm:text-xs focus:outline-none focus:border-blue-500 font-mono"
                />
                <span className="text-gray-400">/ {totalPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 disabled:opacity-30 cursor-pointer transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="h-4 w-px bg-white/10 mx-0.5 sm:mx-1" />

              {/* In-Viewer Zoom Controls */}
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.15))}
                disabled={loading}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 disabled:opacity-30 cursor-pointer transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={resetToFitWidth}
                disabled={loading}
                className="text-gray-300 font-mono text-[10px] sm:text-[11px] min-w-[32px] sm:min-w-[36px] text-center font-medium hover:text-white cursor-pointer"
                title="Fit to Width"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={() => setScale(Math.min(2.5, scale + 0.15))}
                disabled={loading}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 disabled:opacity-30 cursor-pointer transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              {/* Desktop Full Immersive Study Mode trigger */}
              <button
                onClick={() => setIsImmersive(true)}
                className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer border border-blue-400/30"
                title="Open Mobile-Optimized Fullscreen Reader"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Study Mode</span>
              </button>

              {onBookmarkToggle && (
                <button
                  onClick={onBookmarkToggle}
                  className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    isBookmarked
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-400" : ""}`} />
                  <span className="hidden md:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors cursor-pointer"
                title="Share Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>

              <a
                href={proxyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors cursor-pointer"
                title="Open Direct PDF"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={proxyUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={onDownload}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {notebookLmUrl && (() => {
                const formattedUrl = /^https?:\/\//i.test(notebookLmUrl.trim())
                  ? notebookLmUrl.trim()
                  : `https://${notebookLmUrl.trim()}`;
                return (
                  <a
                    href={formattedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 sm:space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-md shadow-purple-500/20 cursor-pointer"
                    title="Open in Google NotebookLM"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden sm:inline">NotebookLM</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                );
              })()}

              <button
                onClick={toggleFullscreen}
                className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-lg transition-colors cursor-pointer hidden sm:block"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* PDF Viewing Canvas Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="relative flex-grow min-h-[480px] sm:min-h-[720px] max-h-[82vh] bg-[#0c0e12] overflow-auto flex flex-col items-center p-2.5 sm:p-6 select-none touch-pan-y"
        >
          {loading ? (
            <div className="m-auto text-center p-8 text-gray-400 space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs font-semibold text-gray-300">Rendering PDF Document Canvas...</p>
              <p className="text-[11px] text-gray-500">Loading directly from server...</p>
            </div>
          ) : error ? (
            <div className="m-auto p-6 text-center bg-[#141720] border border-white/10 rounded-2xl max-w-md space-y-4 shadow-xl">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Browser Viewer Restriction</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{error}</p>
              </div>
              <div className="flex items-center justify-center space-x-3 pt-2">
                <a
                  href={proxyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Open PDF
                </a>
                <a
                  href={proxyUrl}
                  download
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Download File
                </a>
              </div>
            </div>
          ) : isMobile && mobileViewMode === "swipe" ? (
            /* MOBILE SWIPE FLIP VIEW MODE */
            <div
              className="w-full flex-grow flex flex-col items-center justify-center relative touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className={`transition-transform duration-200 ease-out flex flex-col items-center justify-center ${
                  isFlipping ? "scale-95 opacity-50" : ""
                }`}
                style={{
                  transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)`,
                }}
              >
                <canvas
                  ref={singleCanvasRef}
                  className="rounded-xl shadow-2xl border border-white/15 bg-white max-w-full"
                />
              </div>

              <div className="mt-4 flex items-center space-x-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full text-[11px] text-gray-300 shadow-lg backdrop-blur-md">
                <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Swipe left ◄ ► right to flip pages</span>
              </div>
            </div>
          ) : (
            /* CONTINUOUS VERTICAL SCROLL MODE (Desktop & Mobile Default) */
            <div className="flex flex-col items-center space-y-4 sm:space-y-6 w-full py-2 sm:py-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <div
                  key={pageNum}
                  className="flex flex-col items-center relative group w-full max-w-full"
                >
                  <div className="mb-1.5 text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center space-x-2">
                    <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      Page {pageNum} of {totalPages}
                    </span>
                  </div>
                  <canvas
                    ref={(el) => {
                      pageCanvasRefs.current[pageNum] = el;
                    }}
                    className="rounded-xl shadow-2xl border border-white/15 bg-white transition-all max-w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Footer Mobile Quick Bar */}
        <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#14171f] border-t border-white/5 text-xs text-gray-400 gap-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[11px] text-gray-300">
              {isMobile
                ? "Tap 'Study Mode' for distraction-free full screen reader with page slider."
                : "Continuous Vertical Scroll Mode active. Click Study Mode for immersive reading."}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsImmersive(true)}
              className="text-blue-400 hover:text-blue-300 font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Launch Fullscreen Reader</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


