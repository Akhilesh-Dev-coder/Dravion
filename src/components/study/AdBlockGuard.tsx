/**
 * AdBlockGuard — Dravion Study Section
 *
 * Detects likely ad-blocking signals and presents a branded recovery overlay
 * **only for the study section**. The guard distinguishes between:
 *   - CONFIRMED   – two or more independent signals agree ads are being blocked
 *   - INCONCLUSIVE – signals conflict or could not be read reliably
 *   - CLEAR        – no meaningful blocking evidence found
 *
 * Key design decisions:
 *  - Uses multiple independent signals (bait element + adsbygoogle readiness)
 *    rather than a single heuristic, to reduce false positives.
 *  - AdSense returning no ad does NOT equal ad blocking. Inventory shortfalls,
 *    pending account approval, consent settings, or network errors all cause
 *    the same symptom. We never enforce the overlay on INCONCLUSIVE results.
 *  - ENFORCEMENT_ENABLED lets you test detection without blocking real visitors
 *    while your AdSense account is pending.
 *  - No artificial ad clicks, no fake impressions, no user-agent snooping.
 *  - Fully accessible: ARIA dialog, focus-trap, keyboard restore, reduced-motion.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ENFORCEMENT TOGGLE
 *   Set ENFORCEMENT_ENABLED to `true` once your AdSense account is approved and
 *   you are confident the detection signals are stable in production.
 *   While `false` detection still runs and logs, but the overlay never appears.
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import { ShieldAlert, RefreshCw, Loader2, ExternalLink, Eye } from "lucide-react";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

/**
 * ENFORCEMENT_ENABLED
 *
 * When `false`:  detection runs silently. The overlay is never shown.
 *                Use this while your AdSense account is "Getting ready"
 *                or during local/staging testing.
 *
 * When `true`:   overlay appears whenever CONFIRMED blocking is detected.
 *                Set to `true` to enforce the overlay in production.
 */
const ENFORCEMENT_ENABLED = true;

/** Must match the publisher ID in layout.tsx and AdSlot.tsx. */
const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-1988525992738589";

/**
 * Grace period (ms) to allow scripts and DOM to settle before reading signals.
 * 2500 ms covers most network conditions without feeling sluggish.
 */
const DETECTION_DELAY_MS = 2500;

/** How long to wait after a retry before re-evaluating signals. */
const RECHECK_DELAY_MS = 2000;

// ─── TYPES ────────────────────────────────────────────────────────────────────

type DetectionResult = "CONFIRMED" | "INCONCLUSIVE" | "CLEAR";
type Phase = "IDLE" | "CHECKING" | "RECHECKING" | DetectionResult;

// ─── DETECTION HELPERS ────────────────────────────────────────────────────────

/**
 * runBaitTest
 * Inserts a hidden element that mimics an ad container and checks whether
 * an ad-blocking extension has hidden or removed it. Cleaned up immediately —
 * never renders visibly and never produces an ad impression.
 */
function runBaitTest(): boolean {
  try {
    const bait = document.createElement("div");
    bait.className =
      "adsbygoogle adsbox doubleclick ad-placement ad ad-container ads";
    bait.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;pointer-events:none;";
    bait.setAttribute("data-ad-client", ADSENSE_CLIENT);
    bait.setAttribute("aria-hidden", "true");
    document.body.appendChild(bait);

    const style = window.getComputedStyle(bait);
    const blocked =
      bait.offsetParent === null ||
      style.display === "none" ||
      style.visibility === "hidden" ||
      bait.offsetHeight === 0;

    document.body.removeChild(bait);
    return blocked;
  } catch {
    // DOM manipulation failed — treat as inconclusive, not confirmed blocking
    return false;
  }
}

/**
 * checkAdSenseScript
 * Verifies the AdSense script element is present and that window.adsbygoogle
 * was initialised by it.
 *
 * Returns:
 *   "present" – script tag exists AND adsbygoogle is initialised
 *   "absent"  – script tag is missing (likely blocked by the browser/extension)
 *   "pending" – script tag exists but runtime hasn't initialised yet
 *               (could be latency or blocking — inconclusive)
 */
function checkAdSenseScript(): "present" | "absent" | "pending" {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "pending";
  }

  const scriptPresent = !!document.querySelector(
    `script[src*="pagead2.googlesyndication.com"]`
  );

  if (!scriptPresent) return "absent";

  const adsbyoogle = (window as unknown as Record<string, unknown>)["adsbygoogle"];
  if (adsbyoogle !== undefined && adsbyoogle !== null) return "present";

  return "pending";
}

/**
 * evaluate
 * Combines the two signals into a single verdict, called AFTER the
 * DETECTION_DELAY_MS grace period has already elapsed.
 *
 * CONFIRMED:
 *   • bait blocked AND script absent   — both strong signals agree
 *   • bait blocked AND script pending  — Brave Shields (and many extensions)
 *     block the network fetch for pagead2.googlesyndication.com but leave the
 *     <script> tag in the DOM, so the script status never advances past
 *     "pending". After 2 500 ms the grace period has passed; a still-pending
 *     adsbygoogle combined with a blocked bait element is reliable evidence of
 *     ad blocking.
 *
 * INCONCLUSIVE:
 *   • bait NOT blocked AND script absent  — network failure without DOM hiding
 *   • bait NOT blocked AND script pending — AdSense very slow or unavailable
 *     (could be approval status, server-side error, or extreme latency)
 *
 * CLEAR:
 *   • script is initialised AND bait not blocked — nothing is being filtered
 */
function evaluate(
  baitBlocked: boolean,
  scriptStatus: "present" | "absent" | "pending"
): DetectionResult {
  // Both strong signals OR the classic Brave/extension pattern
  if (baitBlocked && (scriptStatus === "absent" || scriptStatus === "pending")) {
    return "CONFIRMED";
  }
  // One weak signal — fail open
  if (!baitBlocked && scriptStatus === "absent") return "INCONCLUSIVE";
  return "CLEAR";
}

// ─── FOCUS TRAP ───────────────────────────────────────────────────────────────

const FOCUSABLE =
  'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),' +
  'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

function trapFocus(container: HTMLElement, e: KeyboardEvent) {
  const els = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE)
  ).filter((el) => !el.closest("[inert]"));
  if (els.length === 0) return;
  const first = els[0];
  const last = els[els.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

export type AdBlockContextValue = {
  result: Phase;
  enforcementEnabled: boolean;
};

export const AdBlockContext = createContext<AdBlockContextValue>({
  result: "IDLE",
  enforcementEnabled: ENFORCEMENT_ENABLED,
});

/** Hook for child components that need to react to ad-block state. */
export function useAdBlockState() {
  return useContext(AdBlockContext);
}

// ─── OVERLAY ──────────────────────────────────────────────────────────────────

interface OverlayProps {
  onRetry: () => void;
  isRechecking: boolean;
  recheckFailed: boolean;
}

function AdBlockOverlay({ onRetry, isRechecking, recheckFailed }: OverlayProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const retryBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;
    retryBtnRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      prevFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Tab") trapFocus(dialog, e);
      // Escape intentionally does NOT close — visitor must change settings first
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(5,8,18,0.93)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="abg-title"
        aria-describedby="abg-desc"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div className="abg-panel">
          {/* Shield icon */}
          <div className="abg-icon-wrap" aria-hidden="true">
            <ShieldAlert className="abg-icon" />
          </div>

          {/* Title */}
          <h2 id="abg-title" className="abg-title">
            Please allow ads to continue
          </h2>

          {/* Description */}
          <p id="abg-desc" className="abg-desc">
            Dravion Study is completely free — advertising is our only revenue
            source and allows us to keep notes, question papers, and practice
            resources available at no charge. It looks like ads are being
            filtered on this page.
          </p>

          {/* Instructions */}
          <div className="abg-instructions" aria-label="How to allow ads">
            <section>
              <h3 className="abg-inst-heading">Using Brave browser?</h3>
              <p className="abg-inst-body">
                Tap the <strong>Brave Shields icon</strong> (lion) in your
                address bar → set &ldquo;Block ads and trackers&rdquo; to{" "}
                <strong>Off</strong> for{" "}
                <strong className="abg-domain">dravion.site</strong>. Brave
                Shields and ad-blocking extensions can produce identical
                symptoms — we cannot distinguish between them with certainty.
              </p>
            </section>

            <div className="abg-divider" />

            <section>
              <h3 className="abg-inst-heading">Using an ad-blocking extension?</h3>
              <p className="abg-inst-body">
                Open your extension (e.g. uBlock Origin, AdBlock Plus) → click{" "}
                <strong>pause on this site</strong> or add{" "}
                <strong className="abg-domain">dravion.site</strong> to your
                allowlist. Then click Retry below.
              </p>
            </section>
          </div>

          {/* Retry button */}
          <button
            ref={retryBtnRef}
            onClick={onRetry}
            disabled={isRechecking}
            className={`abg-retry-btn${isRechecking ? " abg-retry-btn--checking" : ""}`}
            aria-label={
              isRechecking
                ? "Checking your settings, please wait"
                : "I have changed my settings — Retry detection"
            }
          >
            {isRechecking ? (
              <>
                <Loader2 className="abg-btn-icon abg-spin" aria-hidden="true" />
                <span>Checking your settings…</span>
              </>
            ) : (
              <>
                <RefreshCw className="abg-btn-icon" aria-hidden="true" />
                <span>I&apos;ve changed my settings — Retry</span>
              </>
            )}
          </button>

          {/* Recheck failed alert */}
          {recheckFailed && !isRechecking && (
            <p role="alert" aria-live="polite" className="abg-alert">
              Ads still appear to be filtered. Please double-check your
              settings, then click Retry again.
            </p>
          )}

          {/* Transparency footer */}
          <p className="abg-footer">
            Ads are served by Google AdSense in compliance with their{" "}
            <a
              href="https://support.google.com/adsense/answer/48182"
              target="_blank"
              rel="noopener noreferrer"
              className="abg-link"
              aria-label="Google AdSense publisher policies (opens in a new tab)"
            >
              publisher policies
              <ExternalLink className="abg-ext-icon" aria-hidden="true" />
            </a>
            . We do not place forced clicks or artificial impressions.
          </p>
        </div>
      </div>

      {/* Scoped styles — no Tailwind utilities so nothing can be purged */}
      <style>{`
        /* ── Panel ── */
        .abg-panel {
          background: linear-gradient(145deg, #0d1117 0%, #0f1929 55%, #091018 100%);
          border: 1px solid rgba(34,211,238,0.18);
          border-radius: 1.25rem;
          box-shadow: 0 0 0 1px rgba(34,211,238,0.06),
                      0 32px 80px rgba(0,0,0,0.72),
                      0 0 60px rgba(34,211,238,0.04);
          max-width: 480px;
          width: 100%;
          padding: clamp(1.5rem,5vw,2.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.125rem;
          animation: abg-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes abg-in {
          from { opacity:0; transform:scale(0.93) translateY(14px); }
          to   { opacity:1; transform:scale(1)    translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .abg-panel { animation: none; }
        }

        /* ── Icon ── */
        .abg-icon-wrap {
          width: 72px; height: 72px;
          border-radius: 1rem;
          background: rgba(34,211,238,0.09);
          border: 1px solid rgba(34,211,238,0.22);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .abg-icon { width:36px; height:36px; color:#22d3ee; }

        /* ── Typography ── */
        .abg-title {
          font-size: clamp(1.1rem,4vw,1.45rem);
          font-weight: 800;
          color: #f0f9ff;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .abg-desc {
          font-size: 0.8125rem;
          color: #94a3b8;
          line-height: 1.65;
          margin: 0;
          max-width: 400px;
        }

        /* ── Instructions box ── */
        .abg-instructions {
          width: 100%;
          background: rgba(15,23,42,0.6);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.75rem;
          padding: 1rem 1.125rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .abg-inst-heading {
          font-size: 0.7rem;
          font-weight: 700;
          color: #22d3ee;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin: 0 0 0.25rem;
        }
        .abg-inst-body {
          font-size: 0.78rem;
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0;
        }
        .abg-inst-body strong { color: #f1f5f9; }
        .abg-domain { color: #22d3ee !important; }
        .abg-divider {
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 0 -0.125rem;
        }

        /* ── Retry button ── */
        .abg-retry-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.8rem 1.5rem;
          background: linear-gradient(135deg,#0e7490 0%,#0891b2 60%,#06b6d4 100%);
          border: 1px solid rgba(34,211,238,0.32);
          border-radius: 0.75rem;
          color: #ecfeff;
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: opacity 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 24px rgba(34,211,238,0.16);
          min-height: 48px; /* WCAG touch target */
        }
        .abg-retry-btn:hover:not(:disabled) { opacity: 0.9; }
        .abg-retry-btn:focus-visible {
          outline: 2px solid #22d3ee;
          outline-offset: 3px;
        }
        .abg-retry-btn--checking {
          background: rgba(34,211,238,0.08);
          box-shadow: none;
          color: #67e8f9;
          cursor: not-allowed;
        }
        .abg-btn-icon { width:16px; height:16px; flex-shrink:0; }
        @keyframes abg-spin { to { transform: rotate(360deg); } }
        .abg-spin { animation: abg-spin 1s linear infinite; }

        /* ── Alerts & footer ── */
        .abg-alert {
          font-size: 0.75rem;
          color: #f87171;
          margin: 0;
          line-height: 1.5;
        }
        .abg-footer {
          font-size: 0.7rem;
          color: #475569;
          margin: 0;
          line-height: 1.55;
        }
        .abg-link { color: #38bdf8; text-underline-offset: 2px; }
        .abg-link:focus-visible { outline: 1px solid #38bdf8; border-radius: 2px; }
        .abg-ext-icon {
          display: inline;
          width: 10px;
          height: 10px;
          margin-left: 3px;
          vertical-align: middle;
        }
      `}</style>
    </>
  );
}

// ─── DEV DIAGNOSTIC BADGE ─────────────────────────────────────────────────────

function DevBadge({ phase }: { phase: Phase }) {
  if (process.env.NODE_ENV !== "development") return null;
  const colour =
    phase === "CONFIRMED" ? "#ef4444"
    : phase === "INCONCLUSIVE" ? "#f59e0b"
    : phase === "CLEAR" ? "#22c55e"
    : "#94a3b8";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        bottom: "12px",
        right: "12px",
        zIndex: 9997,
        background: "#0f172a",
        border: `1px solid ${colour}`,
        borderRadius: "0.5rem",
        padding: "4px 10px",
        fontSize: "11px",
        fontFamily: "monospace",
        color: colour,
        display: "flex",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Eye style={{ width: "11px", height: "11px" }} />
      AdBlock: {phase}
      {!ENFORCEMENT_ENABLED && " [enforcement OFF]"}
    </div>
  );
}

// ─── MAIN GUARD ───────────────────────────────────────────────────────────────

/**
 * AdBlockGuard
 *
 * Wrap the study section content with this component (done inside the study
 * layout server component via AdBlockGuardWrapper). It runs detection after
 * DETECTION_DELAY_MS and, when ENFORCEMENT_ENABLED is true and blocking is
 * CONFIRMED, renders a full-screen overlay.
 *
 * INCONCLUSIVE results never trigger the overlay — fail-open by design.
 */
export default function AdBlockGuard({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("IDLE");
  const [recheckFailed, setRecheckFailed] = useState(false);
  // Guards against React 18/19 Strict Mode double-invocation in development
  const didInit = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const detect = useCallback((): DetectionResult => {
    const bait = runBaitTest();
    const script = checkAdSenseScript();
    const verdict = evaluate(bait, script);
    if (process.env.NODE_ENV === "development") {
      console.info(
        `[AdBlockGuard] bait=${bait} script=${script} verdict=${verdict} enforce=${ENFORCEMENT_ENABLED}`
      );
    }
    return verdict;
  }, []);

  // Initial detection — single run after grace period
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    setPhase("CHECKING");
    timerRef.current = setTimeout(() => {
      setPhase(detect());
    }, DETECTION_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [detect]);

  const handleRetry = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("RECHECKING");
    setRecheckFailed(false);
    timerRef.current = setTimeout(() => {
      const verdict = detect();
      setPhase(verdict);
      if (verdict === "CONFIRMED") setRecheckFailed(true);
    }, RECHECK_DELAY_MS);
  }, [detect]);

  // Overlay is only shown when:
  //  1. Enforcement is explicitly enabled
  //  2. AND we have a CONFIRMED verdict (INCONCLUSIVE → fail-open)
  const showOverlay =
    ENFORCEMENT_ENABLED &&
    (phase === "CONFIRMED" ||
      // Keep overlay visible during recheck if previous attempt also failed
      (phase === "RECHECKING" && recheckFailed));

  const ctxValue: AdBlockContextValue = {
    result: phase,
    enforcementEnabled: ENFORCEMENT_ENABLED,
  };

  return (
    <AdBlockContext.Provider value={ctxValue}>
      {/* Background content is always server-rendered; inert attr prevents
          keyboard access when the overlay is showing */}
      <div
        {...(showOverlay ? { inert: "" as unknown as boolean } : {})}
        style={showOverlay ? { pointerEvents: "none", userSelect: "none" } : undefined}
      >
        {children}
      </div>

      {/* Development badge — invisible in production */}
      {phase !== "IDLE" && <DevBadge phase={phase} />}

      {/* Blocking overlay */}
      {showOverlay && (
        <AdBlockOverlay
          onRetry={handleRetry}
          isRechecking={phase === "RECHECKING"}
          recheckFailed={recheckFailed}
        />
      )}
    </AdBlockContext.Provider>
  );
}
