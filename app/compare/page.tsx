"use client";
import BattleMode from "@/components/agent/BattleMode";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Swords, BarChart3, Brain, Trophy } from "lucide-react";

const HOW_STEPS = [
  { Icon: Swords,   title: "Enter two companies", desc: "Type any two publicly traded companies you want to head-to-head." },
  { Icon: Brain,    title: "AI runs dual analysis", desc: "Gemini analyses both simultaneously across 5 key investment categories." },
  { Icon: BarChart3,title: "Category breakdown", desc: "Growth, profitability, valuation, risk, and momentum scored side-by-side." },
  { Icon: Trophy,   title: "Winner declared", desc: "One clear winner with full reasoning and a confidence percentage." },
];

export default function ComparePage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar activePage="compare" />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 56 }}>
          <p className="eyebrow eyebrow-accent" style={{ marginBottom: 12 }}>
            <span className="glow-dot glow-dot-blue" aria-hidden="true" />
            Head-to-Head Analysis
          </p>
          <h1 className="text-display-sm gradient-text-warm" style={{ marginBottom: 12 }}>
            Battle Mode
          </h1>
          <p className="text-body" style={{ maxWidth: 460, margin: "0 auto", fontSize: 16 }}>
            Enter two companies and our AI will pick the stronger investment in seconds.
          </p>
        </header>

        {/* Battle component */}
        <BattleMode fullPage />

        {/* How it works */}
        <section
          aria-labelledby="how-it-works-heading"
          style={{
            marginTop: 72,
            padding: 36,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
          }}
        >
          <p className="eyebrow eyebrow-primary" style={{ marginBottom: 10 }}>
            <span className="glow-dot glow-dot-blue" aria-hidden="true" />
            How it works
          </p>
          <h2 id="how-it-works-heading" style={{ fontSize: 18, fontWeight: 700, marginBottom: 28, color: "var(--text-secondary)" }}>
            Behind Battle Mode
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
            {HOW_STEPS.map(({ Icon, title, desc }, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div
                  style={{
                    width: 40, height: 40, borderRadius: "var(--radius-md)",
                    background: "var(--primary-dim)", border: "1px solid rgba(59,130,246,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={18} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
