"use client";
import type { Recommendation, CompanyData } from "@/lib/types";
import { TrendingUp, TrendingDown, Target, Clock, Percent } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function RecommendationCard({
  recommendation, company, score,
}: {
  recommendation: Recommendation; company: CompanyData; score: number;
}) {
  const isInvest = recommendation.decision === "INVEST";
  const radius   = 52;
  const circ     = 2 * Math.PI * radius;
  const offset   = circ - (score / 100) * circ;
  const col      = isInvest ? "var(--success)" : "var(--danger)";
  const colDim   = isInvest ? "var(--success-dim)" : "var(--danger-dim)";
  const colBorder= isInvest ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)";

  return (
    <section
      aria-label={`Final verdict: ${recommendation.decision}`}
      style={{
        background: colDim,
        border: `2px solid ${colBorder}`,
        borderRadius: "var(--radius-xl)", padding: 32,
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <p className="text-caption" style={{ marginBottom: 10 }}>Final Verdict</p>
          <div
            style={{
              fontSize: 64, fontWeight: 900, color: col,
              letterSpacing: "-0.025em", lineHeight: 1,
              textShadow: `0 0 40px ${col}60`,
            }}
            aria-label={recommendation.decision}
          >
            {recommendation.decision}
          </div>
          <p style={{ marginTop: 14, fontSize: 15, color: "var(--text-secondary)", maxWidth: 420, lineHeight: 1.65 }}>
            {recommendation.verdict}
          </p>

          {/* Meta chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
            <span className="chip">
              <Percent size={11} />
              {recommendation.confidence}% confidence
            </span>
            <span className="chip">
              <Clock size={11} />
              {recommendation.timeHorizon}-term
            </span>
            {recommendation.targetPrice && (
              <span
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: `${col}1A`, color: col, border: `1px solid ${col}35`,
                  borderRadius: "var(--radius-full)", padding: "4px 12px",
                  fontSize: 12, fontWeight: 700,
                }}
              >
                <Target size={11} />
                Target: ${recommendation.targetPrice}
              </span>
            )}
          </div>
        </div>

        {/* Score ring */}
        <div style={{ position: "relative", width: 130, height: 130, flexShrink: 0 }} aria-label={`Score: ${score} out of 100`}>
          <svg width="130" height="130" style={{ transform: "rotate(-90deg)" }} aria-hidden="true">
            <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
            <circle
              cx="65" cy="65" r={radius} fill="none" stroke={col} strokeWidth="10"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s ease", filter: `drop-shadow(0 0 8px ${col})` }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: "var(--text-primary)" }}>{score}</div>
            <div className="text-caption">Score</div>
          </div>
        </div>
      </div>

      {/* Reasons grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
        {/* Bull case */}
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--success)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingUp size={14} />
            Reasons to Invest
          </h3>
          <ul style={{ listStyle: "none" }}>
            {recommendation.investReasons.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "var(--success)", marginTop: 3, fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bear case */}
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--danger)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <TrendingDown size={14} />
            Reasons Not to Invest
          </h3>
          <ul style={{ listStyle: "none" }}>
            {recommendation.passReasons.map((r, i) => (
              <li key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "var(--danger)", marginTop: 3, fontSize: 10, flexShrink: 0 }}>●</span>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analyst note */}
      <blockquote
        style={{
          marginTop: 24, padding: "14px 18px",
          background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-md)",
          borderLeft: `3px solid ${col}`,
          fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, fontStyle: "italic",
        }}
      >
        💬 {recommendation.analystNote}
      </blockquote>
    </section>
  );
}
