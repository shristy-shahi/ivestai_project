"use client";
import { useEffect, useState } from "react";

const STEPS = [
  "✓ Reading Financial Statements",
  "✓ Checking News Sources",
  "✓ Evaluating Risks",
  "✓ Comparing Competitors",
  "✓ Building Recommendation",
];

export default function AnalystWorkspace() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [reportNum, setReportNum] = useState<number | null>(null);
  const [timeStr, setTimeStr] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setReportNum(Math.floor(Math.random() * 500) + 100);
    setMounted(true);

    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 1000);

    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= STEPS.length) {
          setTimeout(() => setVisibleCount(0), 2000);
          return c;
        }
        return c + 1;
      });
    }, 900);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        background: "rgba(13,18,32,0.95)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px", minWidth: 260,
        backdropFilter: "blur(16px)",
        boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
        position: "relative", overflow: "hidden",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s var(--ease-spring)",
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      
      {/* Moving scanline */}
      <div
        style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)",
          animation: "scanline 3s ease-in-out infinite",
          pointerEvents: "none", zIndex: 2,
        }}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, position: "relative", zIndex: 3 }}>
        <span className="text-caption">
          ANALYST WORKSPACE
        </span>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>
          #{reportNum ?? "..."}
        </span>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 3 }}>
        {STEPS.map((step, i) => (
          <div
            key={step}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              opacity: i < visibleCount ? 1 : 0.25,
              transform: i < visibleCount ? "translateX(0)" : "translateX(-8px)",
              transition: "all 0.5s var(--ease-spring)",
              transitionDelay: `${i * 0.05}s`,
            }}
          >
            <div
              style={{
                width: 6, height: 6, borderRadius: "50%",
                background: i < visibleCount ? "var(--primary)" : "var(--bg-overlay)",
                flexShrink: 0,
                boxShadow: i < visibleCount ? "0 0 8px var(--primary), var(--shadow-glow-primary)" : "none",
                transition: "all 0.4s ease",
              }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: 11,
                color: i < visibleCount ? "var(--text-primary)" : "var(--text-tertiary)",
                transition: "color 0.4s ease",
                textShadow: i < visibleCount ? "0 0 12px rgba(59,130,246,0.2)" : "none",
              }}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 16, paddingTop: 12,
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between",
          position: "relative", zIndex: 3,
        }}
      >
        <span className="font-mono" style={{ fontSize: 10, color: "var(--text-tertiary)" }}>Generated at</span>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
}
