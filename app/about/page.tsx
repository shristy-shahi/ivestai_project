"use client";
import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";

const PIPELINE = [
  {
    step: "01", icon: "🏢", name: "Company Research", color: "var(--primary)",
    desc: "The first agent builds a full company profile — CEO, founding year, HQ, market cap, products, business model, and recent developments using LLM knowledge.",
    outputs: ["Company name & ticker", "Industry & sector", "Business model", "Recent developments"],
  },
  {
    step: "02", icon: "📊", name: "Financial Analysis", color: "var(--success)",
    desc: "Analyses the last 4 years of revenue, EPS, P/E ratio, operating margin, cash flow, debt-to-equity, and ROE. Produces time-series charts.",
    outputs: ["Revenue history (4yr)", "EPS & P/E ratio", "Operating margins", "Financial rating"],
  },
  {
    step: "03", icon: "📰", name: "News Collection", color: "var(--warning)",
    desc: "Generates 6 realistic recent headlines across earnings, products, legal, partnerships, and market events — categorised by sentiment.",
    outputs: ["6 recent headlines", "Sentiment labels", "Category tags", "Source attribution"],
  },
  {
    step: "04", icon: "🧠", name: "Sentiment Analysis", color: "var(--success)",
    desc: "Synthesises a 0–100 bullish/bearish score from the news and financial context, counting positive, neutral, and negative signals.",
    outputs: ["0–100 sentiment score", "Bullish/Neutral/Bearish label", "Key themes (tags)", "Sentiment summary"],
  },
  {
    step: "05", icon: "⚔️", name: "Competitor Analysis", color: "var(--danger)",
    desc: "Identifies the top 3 direct competitors with market cap, revenue growth, P/E ratio, and their primary competitive advantage.",
    outputs: ["Top 3 competitors", "Revenue growth comparison", "Competitive advantage", "Market positioning"],
  },
  {
    step: "06", icon: "⚠️", name: "Risk Analysis", color: "var(--accent)",
    desc: "Scores six risk axes — market, regulatory, execution, competition, financial, and macro — and surfaces 4–5 specific risk factors with severity ratings.",
    outputs: ["6-axis risk radar", "Risk factor list", "Severity ratings", "Overall risk level"],
  },
  {
    step: "07", icon: "✅", name: "Investment Decision", color: "var(--primary)",
    desc: "The final agent synthesises all prior data into a decisive INVEST or PASS verdict with confidence score, target price, time horizon, and balanced bull/bear reasoning.",
    outputs: ["INVEST or PASS", "Confidence score", "Bull & bear case", "Target price & horizon"],
  },
];

const TECH = [
  { icon: "🦜", name: "LangGraph",        desc: "Multi-agent state machine orchestration" },
  { icon: "🤖", name: "Gemini 2.5 Flash", desc: "Reasoning and structured JSON output" },
  { icon: "⚡", name: "Next.js 16",        desc: "App Router with SSE streaming" },
  { icon: "🗄️", name: "Supabase",         desc: "PostgreSQL persistence for reports" },
  { icon: "🎨", name: "Three.js + GSAP",  desc: "3D hero scene and scroll animations" },
  { icon: "📊", name: "Recharts",          desc: "Revenue, profit and risk visualisations" },
];

export default function AboutPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar activePage="about" />

      {/* Hero */}
      <section
        aria-label="About hero"
        style={{
          paddingTop: 120, paddingBottom: 64, textAlign: "center", paddingLeft: 24, paddingRight: 24,
          background: "radial-gradient(ellipse at 50% 20%, rgba(59,130,246,0.07) 0%, transparent 55%), var(--bg-base)",
        }}
      >
        <p className="eyebrow eyebrow-primary" style={{ marginBottom: 14 }}>
          <span className="glow-dot glow-dot-blue" aria-hidden="true" />
          About the project
        </p>
        <h1 className="text-display-sm" style={{ maxWidth: 680, margin: "0 auto" }}>
          Institutional-grade AI research,{" "}
          <span className="gradient-text">democratised</span>
        </h1>
        <p className="text-body" style={{ maxWidth: 560, margin: "20px auto 0", fontSize: 16, lineHeight: 1.7 }}>
          Investra uses a 7-node LangGraph multi-agent pipeline to deliver the kind of
          research a Wall Street analyst would take hours to produce — in under 60 seconds.
        </p>

        {/* Stat chips */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
          {[
            { label: "7 AI Agents", color: "var(--primary)" },
            { label: "SSE Streaming", color: "var(--success)" },
            { label: "Gemini AI", color: "var(--warning)" },
            { label: "LangGraph", color: "var(--accent)" },
            { label: "Not financial advice", color: "var(--text-tertiary)" },
          ].map(b => (
            <span
              key={b.label}
              style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-full)", padding: "5px 14px",
                fontSize: 12, fontWeight: 600, color: b.color,
              }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px" }}>

        {/* Pipeline walkthrough */}
        <section aria-labelledby="pipeline-heading" style={{ marginBottom: 80 }}>
          <p className="eyebrow eyebrow-success" style={{ marginBottom: 10 }}>
            <span className="glow-dot glow-dot-green" aria-hidden="true" />
            Architecture
          </p>
          <h2 id="pipeline-heading" className="text-heading" style={{ marginBottom: 40 }}>
            The 7-agent pipeline
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PIPELINE.map((node, i) => {
              const isExpanded = expandedStep === node.step;
              return (
                <div
                  key={node.step}
                  style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 0 }}
                >
                  {/* Left rail */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                      style={{
                        width: 48, height: 48, borderRadius: "var(--radius-md)",
                        background: `${node.color}1A`, border: `1px solid ${node.color}35`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, flexShrink: 0, zIndex: 1,
                      }}
                    >
                      {node.icon}
                    </div>
                    {i < PIPELINE.length - 1 && (
                      <div style={{ width: 1, flex: 1, minHeight: 16, background: `linear-gradient(to bottom, ${node.color}40, transparent)` }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingLeft: 20, paddingBottom: i < PIPELINE.length - 1 ? 24 : 0 }}>
                    <button
                      onClick={() => setExpandedStep(isExpanded ? null : node.step)}
                      aria-expanded={isExpanded}
                      style={{
                        width: "100%", background: "none", border: "none", cursor: "pointer",
                        textAlign: "left", padding: "10px 16px",
                        borderRadius: "var(--radius-md)",
                        transition: "background var(--duration-fast) var(--ease-out)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-surface)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "none")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 10, fontFamily: "monospace", color: node.color, fontWeight: 700 }}>
                          NODE {node.step}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>
                          {node.name}
                        </span>
                      </div>
                      {isExpanded
                        ? <ChevronDown size={15} color="var(--text-tertiary)" />
                        : <ChevronRight size={15} color="var(--text-tertiary)" />
                      }
                    </button>

                    {/* Expandable details */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateRows: isExpanded ? "1fr" : "0fr",
                        transition: "grid-template-rows 0.3s ease",
                      }}
                    >
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ padding: "4px 16px 16px" }}>
                          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 12 }}>
                            {node.desc}
                          </p>
                          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                            {node.outputs.map(o => (
                              <span
                                key={o}
                                style={{
                                  fontSize: 11, fontWeight: 600, color: "var(--text-secondary)",
                                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                                  borderRadius: "var(--radius-sm)", padding: "3px 10px",
                                }}
                              >
                                {o}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tech stack */}
        <section aria-labelledby="tech-heading" style={{ marginBottom: 64 }}>
          <p className="eyebrow eyebrow-warning" style={{ marginBottom: 10 }}>
            <span className="glow-dot glow-dot-amber" aria-hidden="true" />
            Built with
          </p>
          <h2 id="tech-heading" className="text-heading" style={{ marginBottom: 28 }}>
            Technology stack
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
            {TECH.map((t, i) => (
              <div
                key={t.name}
                className="card card-hover"
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  animation: `slide-up 0.4s var(--ease-spring) ${i * 0.06}s both`,
                }}
              >
                <span
                  style={{
                    fontSize: 24, width: 44, height: 44,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--bg-overlay)", borderRadius: "var(--radius-md)", flexShrink: 0,
                  }}
                >
                  {t.icon}
                </span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div
          className="alert alert-error"
          role="note"
          aria-label="Financial disclaimer"
          style={{ flexDirection: "column", padding: 24, borderRadius: "var(--radius-lg)", gap: 10 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
            ⚠️ Not Financial Advice
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-secondary)" }}>
            Investra is a demonstration of multi-agent AI capabilities. All analysis is AI-generated
            and should not be used as the sole basis for investment decisions. Always consult a
            qualified financial advisor before investing.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
