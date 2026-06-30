"use client";
import type { AgentStep } from "@/lib/types";
import { CheckCircle2, Circle } from "lucide-react";

const STEPS: { id: AgentStep; label: string; icon: string; desc: string }[] = [
  { id: "company_research",    label: "Company Research",   icon: "🏢", desc: "Profile, CEO, Products"  },
  { id: "financial_analysis",  label: "Financial Analysis", icon: "📊", desc: "Revenue, EPS, Cash Flow" },
  { id: "news_collection",     label: "News Collection",    icon: "📰", desc: "Latest Headlines"        },
  { id: "sentiment_analysis",  label: "Sentiment Analysis", icon: "🧠", desc: "Market Mood Score"       },
  { id: "competitor_analysis", label: "Competitor Analysis",icon: "⚔️", desc: "Market Position"         },
  { id: "risk_analysis",       label: "Risk Analysis",      icon: "⚠️", desc: "Risk Radar"              },
  { id: "investment_decision", label: "Final Decision",     icon: "✅", desc: "INVEST / PASS"           },
];

export default function AgentGraph({
  currentStep, completedSteps,
}: {
  currentStep: AgentStep; completedSteps: AgentStep[];
}) {
  const getStatus = (id: AgentStep) =>
    completedSteps.includes(id) ? "done" : currentStep === id ? "active" : "pending";

  const isRunning = currentStep !== "idle" && currentStep !== "complete";
  const progress = (completedSteps.length / STEPS.length) * 100;

  return (
    <div
      className="card"
      role="status"
      aria-label={`Agent pipeline: ${completedSteps.length} of ${STEPS.length} steps complete`}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span
          className={`glow-dot ${isRunning ? "glow-dot-amber" : completedSteps.length > 0 ? "glow-dot-green" : "glow-dot-blue"}`}
          aria-hidden="true"
        />
        <span className="text-caption">Agent Pipeline</span>
        {completedSteps.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>
            {completedSteps.length}/{STEPS.length}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {STEPS.map(step => {
          const status = getStatus(step.id);
          return (
            <div
              key={step.id}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: "var(--radius-md)",
                background: status === "active" ? "var(--primary-dim)" : status === "done" ? "var(--success-dim)" : "transparent",
                border: status === "active" ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                opacity: status === "pending" ? 0.35 : 1,
                transition: "all var(--duration-base) var(--ease-out)",
              }}
            >
              {/* Icon circle */}
              <div
                aria-hidden="true"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, flexShrink: 0,
                  background: status === "done"   ? "var(--success)"
                             : status === "active" ? "var(--primary)"
                             : "var(--bg-overlay)",
                  boxShadow: status === "active" ? "var(--shadow-glow-primary)"
                           : status === "done"   ? "var(--shadow-glow-success)" : "none",
                }}
              >
                {status === "done" ? (
                  <CheckCircle2 size={16} color="#fff" />
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Text */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: status === "pending" ? "var(--text-tertiary)" : "var(--text-primary)" }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>{step.desc}</div>
                {status === "active" && (
                  <div
                    style={{
                      fontSize: 9, color: "var(--primary)", fontWeight: 800,
                      letterSpacing: "0.06em", marginTop: 2,
                      animation: "blink 1.2s ease-in-out infinite",
                    }}
                    aria-live="polite"
                  >
                    ANALYZING…
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
