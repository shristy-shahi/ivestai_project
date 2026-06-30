"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CARDS = [
  { company: "NVIDIA", ticker: "NVDA", decision: "INVEST", score: 91, color: "var(--success)" },
  { company: "Tesla",  ticker: "TSLA", decision: "PASS",   score: 44, color: "var(--danger)"  },
  { company: "Apple",  ticker: "AAPL", decision: "INVEST", score: 78, color: "var(--success)" },
];

export default function FloatingVerdictCards() {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: i * 0.18, ease: "power3.out" }
      );
      gsap.to(card, {
        y: Math.sin(i * 1.2) * 8, duration: 2.5 + i * 0.4,
        repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.7 + i * 0.6,
      });
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: "relative", width: 220, height: 280 }}
    >
      {CARDS.map((card, i) => {
        const isInvest = card.decision === "INVEST";
        return (
          <div
            key={card.ticker}
            ref={el => { if (el) cardsRef.current[i] = el; }}
            style={{
              position: "absolute",
              top: i * 70, left: i * 8,
              background: "rgba(13,18,32,0.9)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${isInvest ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
              borderRadius: 14,
              padding: "12px 16px",
              width: 200,
              boxShadow: `var(--shadow-md), 0 0 0 1px rgba(255,255,255,0.04)`,
              zIndex: CARDS.length - i,
              opacity: 0, cursor: "default",
              transition: "transform 0.3s var(--ease-spring), box-shadow 0.3s ease",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "perspective(600px) rotateX(-3deg) rotateY(3deg) scale(1.04)";
              e.currentTarget.style.boxShadow = `var(--shadow-lg), 0 0 20px ${isInvest ? "rgba(16,185,129,0.2)" : "rgba(244,63,94,0.2)"}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
              e.currentTarget.style.boxShadow = `var(--shadow-md), 0 0 0 1px rgba(255,255,255,0.04)`;
            }}
          >
            {/* Shimmer */}
            <div
              style={{
                position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)",
                animation: `shimmer-sweep ${3 + i * 0.5}s ease-in-out ${i * 1.2}s infinite`,
                pointerEvents: "none",
              }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{card.company}</div>
                <div className="font-mono" style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{card.ticker}</div>
              </div>
              <span
                className={`badge ${isInvest ? "badge-invest" : "badge-pass"}`}
              >
                {card.decision}
              </span>
            </div>

            {/* Score bar */}
            <div className="progress-track" style={{ marginTop: 10, height: 4 }}>
              <div
                style={{
                  width: `${card.score}%`, height: "100%",
                  borderRadius: "var(--radius-full)",
                  background: isInvest ? "var(--success)" : "var(--danger)",
                  boxShadow: `0 0 6px ${isInvest ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"}`,
                }}
              />
            </div>
            <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 4 }}>Score: {card.score}/100</div>
          </div>
        );
      })}
    </div>
  );
}
