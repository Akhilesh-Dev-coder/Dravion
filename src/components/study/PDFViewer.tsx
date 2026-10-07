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
  Eye,
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
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileViewMode, setMobileViewMode] = useState<"scroll" | "swipe">("scroll");

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
          const containerWidth = (containerRef.current.clientWidth || window.innerWidth) - (isMobile ? 8 : 40);
          if (containerWidth > 0 && unscaledViewport.width > 0) {
            const fitScale = Math.min(2.5, Math.max(0.6, containerWidth / unscaledViewport.width));
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
      const containerWidth = (containerRef.current?.clientWidth || window.innerWidth) - (isMobile ? 8 : 40);
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

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-xl transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-none h-screen" : "w-full"
      }`}
    >
      {/* Top Toolbar Header */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 px-2 sm:px-4 py-2 bg-slate-100/90 border-b border-slate-200">
        {/* Left: Title & Focus Action */}
        <div className="flex items-center justify-between space-x-2 min-w-0 w-full md:w-auto">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 border border-blue-200">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[150px] sm:max-w-xs">
                {title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                P.{currentPage} of {totalPages || "?"}
              </p>
            </div>
          </div>

          {/* Focus button on Mobile right header */}
          <div className="flex items-center space-x-1.5 md:hidden">
            <a
              href={proxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 bg-blue-600 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm"
              title="Focus View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Focus</span>
            </a>
          </div>
        </div>

        {/* Center & Right Controls */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Page Controls & Zoom */}
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1 text-xs shrink-0 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-0.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-0.5 text-xs">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-7 text-center bg-slate-50 border border-slate-300 rounded text-slate-900 py-0.5 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                />
                <span className="text-slate-500 text-[11px]">/{totalPages}</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || loading}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {/* View Mode Toggle (Scroll / Flip) */}
            {isMobile && (
              <div className="flex items-center space-x-0.5 bg-slate-100 rounded-md p-0.5 text-[10px]">
                <button
                  onClick={() => setMobileViewMode("scroll")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    mobileViewMode === "scroll"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Scroll
                </button>
                <button
                  onClick={() => setMobileViewMode("swipe")}
                  className={`px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    mobileViewMode === "swipe"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Flip
                </button>
              </div>
            )}

            <div className="flex items-center space-x-0.5">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.15))}
                disabled={loading}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={resetToFitWidth}
                disabled={loading}
                className="text-slate-700 font-mono text-[11px] font-semibold px-0.5 hover:text-slate-900 cursor-pointer"
                title="Fit Width"
              >
                {Math.round(scale * 100)}%
              </button>
              <button
                onClick={() => setScale(Math.min(2.5, scale + 0.15))}
                disabled={loading}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons (Desktop / Tablet) */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <a
              href={proxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs"
              title="Open Direct PDF in Focus View"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Focus</span>
            </a>

            {onBookmarkToggle && (
              <button
                onClick={onBookmarkToggle}
                className={`p-1.5 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  isBookmarked
                    ? "bg-amber-100 border-amber-300 text-amber-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-amber-600 text-amber-600" : ""}`} />
                <span className="hidden md:inline">{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Share Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            <a
              href={proxyUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDownload}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer"
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
                  className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-2 sm:px-3 py-1.5 rounded-lg transition-all shadow-md shadow-purple-500/20 cursor-pointer"
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
              className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer hidden sm:block"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Body */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-grow min-h-[550px] sm:min-h-[720px] max-h-[85vh] md:max-h-[85vh] bg-slate-200 overflow-auto flex flex-col items-center p-1 sm:p-5 select-none touch-pan-y"
      >
        {loading ? (
          <div className="m-auto text-center p-8 text-slate-600 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
            <p className="text-xs font-bold text-slate-800">Loading PDF document...</p>
          </div>
        ) : error ? (
          <div className="m-auto p-6 text-center bg-white border border-slate-200 rounded-2xl max-w-md space-y-4 shadow-lg">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <p className="text-xs text-slate-700 leading-relaxed">{error}</p>
            <div className="flex items-center justify-center space-x-3 pt-1">
              <a
                href={proxyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
              >
                Open PDF
              </a>
              <a
                href={proxyUrl}
                download
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs"
              >
                Download File
              </a>
            </div>
          </div>
        ) : isMobile && mobileViewMode === "swipe" ? (
          /* MOBILE SWIPE MODE */
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
                className="rounded-lg shadow-xl border border-slate-300 bg-white max-w-full"
              />
            </div>

            <div className="mt-3 flex items-center space-x-2 bg-slate-900/80 text-white px-3 py-1.5 rounded-full text-[11px] shadow-md">
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Swipe left ◄ ► right to flip pages</span>
            </div>
          </div>
        ) : (
          /* CONTINUOUS SCROLL MODE (Desktop & Mobile) */
          <div className="flex flex-col items-center space-y-3 sm:space-y-6 w-full py-1 sm:py-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                className="flex flex-col items-center relative group w-full max-w-full"
              >
                <div className="mb-1 text-[10px] text-slate-500 font-mono flex items-center space-x-2">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-xs">
                    Page {pageNum} of {totalPages}
                  </span>
                </div>
                <canvas
                  ref={(el) => {
                    pageCanvasRefs.current[pageNum] = el;
                  }}
                  className="rounded-lg shadow-xl border border-slate-300 bg-white transition-all max-w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 gap-2">
        <div className="flex items-center space-x-2">
          {isMobile ? (
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span className="text-[11px]">
            {isMobile
              ? "Mobile View: Fit to screen active. Use scroll or flip mode to read smoothly."
              : "Continuous Vertical Scroll Mode active. Use controls to zoom or flip pages."}
          </span>
        </div>
        <a
          href={proxyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700 font-bold text-[11px] flex items-center space-x-1"
        >
          <span>Open PDF directly</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
