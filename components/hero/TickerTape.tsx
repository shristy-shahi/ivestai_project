"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TICKERS = [
  { sym: "NVDA", price: "134.26", chg: "+2.84", pct: "+2.16%", up: true  },
  { sym: "AAPL", price: "211.45", chg: "-0.92", pct: "-0.43%", up: false },
  { sym: "TSLA", price: "248.71", chg: "+6.33", pct: "+2.61%", up: true  },
  { sym: "MSFT", price: "422.08", chg: "+1.44", pct: "+0.34%", up: true  },
  { sym: "AMZN", price: "198.54", chg: "-1.27", pct: "-0.64%", up: false },
  { sym: "GOOG", price: "181.93", chg: "+3.12", pct: "+1.75%", up: true  },
  { sym: "META", price: "563.82", chg: "+8.91", pct: "+1.60%", up: true  },
  { sym: "NFLX", price: "712.44", chg: "-4.18", pct: "-0.58%", up: false },
  { sym: "AMD",  price: "158.37", chg: "+4.22", pct: "+2.74%", up: true  },
  { sym: "BRK",  price: "444.20", chg: "+0.88", pct: "+0.20%", up: true  },
];

export default function TickerTape() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const totalW = el.scrollWidth / 2;
    tweenRef.current = gsap.fromTo(
      el,
      { x: 0 },
      { x: -totalW, duration: 36, ease: "none", repeat: -1 }
    );
    return () => { tweenRef.current?.kill(); };
  }, []);

  const items = [...TICKERS, ...TICKERS];

  return (
    <div
      aria-hidden="true"
      style={{
        overflow: "hidden",
        background: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "10px 0",
        width: "100%", position: "relative",
      }}
    >
      {/* Edge fades */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 80, zIndex: 2, background: `linear-gradient(to right, var(--bg-surface), transparent)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 80, zIndex: 2, background: `linear-gradient(to left, var(--bg-surface), transparent)`, pointerEvents: "none" }} />

      <div ref={trackRef} style={{ display: "flex", whiteSpace: "nowrap" }}>
        {items.map((t, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0 28px",
              borderRight: "1px solid var(--border)",
            }}
          >
            <span className="font-mono" style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>
              {t.sym}
            </span>
            <span className="font-mono" style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              ${t.price}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: 12, fontWeight: 700,
                color: t.up ? "var(--success)" : "var(--danger)",
                textShadow: t.up ? "0 0 6px rgba(16,185,129,0.3)" : "0 0 6px rgba(244,63,94,0.3)",
              }}
            >
              {t.up ? "▲" : "▼"} {t.pct}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
