"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchTerminal    from "@/components/hero/SearchTerminal";
import TickerTape        from "@/components/hero/TickerTape";
import AnalystWorkspace  from "@/components/hero/AnalystWorkspace";
import FloatingVerdictCards from "@/components/hero/FloatingVerdictCards";
import RevealOnScroll    from "@/components/hero/RevealOnScroll";
import ResearchDashboard from "@/components/agent/ResearchDashboard";
import BattleMode        from "@/components/agent/BattleMode";
import ReportHistory     from "@/components/agent/ReportHistory";
import { Testimonials, MoreFeatures, FAQ } from "@/components/hero/LandingSections";
import { useResearchStore } from "@/stores/useResearchStore";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
  Zap, Database, BarChart3, Scale, Swords, Target,
  ArrowRight, ChevronDown
} from "lucide-react";

const StockMarketScene = dynamic(
  () => import("@/components/hero/StockMarketScene"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />
    ),
  }
);

const FEATURES = [
  { Icon: BarChart3, label: "Live Agent Visualization", desc: "Pipeline nodes light up in real time as each agent completes its analysis.", color: "var(--primary)" },
  { Icon: Zap,       label: "SSE Streaming",           desc: "Results stream node-by-node — no waiting, full transparency into the process.", color: "var(--success)" },
  { Icon: Database,  label: "Supabase Persistence",    desc: "Every report is saved to PostgreSQL — track sentiment trends over time.", color: "var(--warning)" },
  { Icon: Scale,     label: "Bull & Bear Case",        desc: "Every analysis surfaces reasons to invest AND reasons to pass — both sides equally.", color: "var(--success)" },
  { Icon: Swords,    label: "Battle Mode",             desc: "Head-to-head AI comparison of any two companies in seconds.", color: "var(--danger)" },
  { Icon: Target,    label: "Confidence Scoring",      desc: "0–100 confidence score with time horizon, target price, and analyst notes.", color: "var(--accent)" },
];

export default function Home() {
  const { state, isLoading, error: storeError, currentStep } = useResearchStore();
  const { user, isAuthenticated, hydrated } = useAuth();
  const [activeTab, setActiveTab] = useState<"battle" | "history">("battle");

  const hasResults = !!(state?.companyData || isLoading || storeError || (currentStep && currentStep !== "idle"));

  const handleNewResearch = () => {
    useResearchStore.getState().reset();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar activePage="home" onNewResearch={hasResults ? handleNewResearch : undefined} />

      <AnimatePresence mode="wait">
        {hasResults ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ paddingTop: 60 }}
          >
            <ResearchDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── HERO ───────────────────────────────────────────────── */}
            <section
              aria-label="Hero"
              style={{
                position: "relative", height: "100vh", overflow: "hidden",
                background: "radial-gradient(ellipse at 30% 50%, rgba(59,130,246,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 60%, rgba(139,92,246,0.05) 0%, transparent 55%), var(--bg-base)",
              }}
            >
              {/* Grid pattern overlay */}
              <div
                aria-hidden="true"
                className="bg-grid-pattern"
                style={{ position: "absolute", inset: 0, opacity: 0.4, pointerEvents: "none" }}
              />

              <StockMarketScene />

              {/* Bottom fade */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
                  background: "linear-gradient(to bottom, transparent, var(--bg-base))",
                  pointerEvents: "none", zIndex: 1,
                }}
              />

              {/* Centre copy */}
              <div
                style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "0 24px", paddingTop: 60, pointerEvents: "none", zIndex: 10,
                }}
              >
                {/* Live badge */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
                  style={{ pointerEvents: "auto", marginBottom: 28 }}
                >
                  <div
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: "var(--radius-full)", padding: "6px 18px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <span className="glow-dot glow-dot-green" aria-hidden="true" />
                    <span
                      style={{
                        fontSize: 12, fontWeight: 700, color: "var(--primary)",
                        letterSpacing: "0.1em", textTransform: "uppercase",
                      }}
                    >
                      Multi-Agent AI · 7 Nodes · Live
                    </span>
                  </div>
                </motion.div>

                <motion.h1
                  className="text-display"
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.25, type: "spring", stiffness: 90 }}
                  style={{ textAlign: "center", maxWidth: 820, color: "var(--text-primary)" }}
                >
                  Your AI{" "}
                  <span className="gradient-text">Investment</span>
                  <br />
                  Research Analyst
                </motion.h1>

                <motion.p
                  className="text-body"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, type: "spring", stiffness: 90 }}
                  style={{ marginTop: 20, fontSize: 17, maxWidth: 500, textAlign: "center" }}
                >
                  Enter any public company. 7 specialist AI agents research it and
                  deliver an{" "}
                  <strong style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                    INVEST / PASS
                  </strong>{" "}
                  verdict in under 60 seconds.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, type: "spring", stiffness: 100 }}
                  style={{ display: "flex", gap: 12, marginTop: 32, pointerEvents: "auto" }}
                >
                  <a href="#research" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
                    Start Analysing
                    <ArrowRight size={16} />
                  </a>
                  <a href="/about" className="btn btn-ghost btn-lg" style={{ textDecoration: "none" }}>
                    How it works
                  </a>
                </motion.div>
              </div>

              {/* Floating verdict cards — left */}
              <motion.div
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.55 }}
                className="hide-tablet"
                style={{
                  position: "absolute", left: "4%", top: "30%",
                  animation: "float-y 5s ease-in-out infinite", zIndex: 5,
                }}
              >
                <FloatingVerdictCards />
              </motion.div>

              {/* Analyst workspace — right */}
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 50, delay: 0.65 }}
                className="hide-mobile"
                style={{
                  position: "absolute", right: "5%", top: "32%",
                  animation: "float-y 4s ease-in-out infinite reverse", zIndex: 5,
                }}
              >
                <AnalystWorkspace />
              </motion.div>

              {/* Scroll cue */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                aria-hidden="true"
                style={{
                  position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                  animation: "float-y 2.5s ease-in-out infinite", zIndex: 10,
                }}
              >
                <span style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  scroll
                </span>
                <ChevronDown size={14} color="var(--text-tertiary)" />
              </motion.div>
            </section>

            {/* ── TICKER TAPE ─────────────────────────────────────────── */}
            <TickerTape />

            {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
            <section style={{ padding: "80px 24px", background: "var(--bg-surface)" }}>
              <div className="container">
                <RevealOnScroll direction="up">
                  <div style={{ textAlign: "center", marginBottom: 52 }}>
                    <p className="eyebrow eyebrow-primary" style={{ marginBottom: 12 }}>
                      <span className="glow-dot glow-dot-blue" aria-hidden="true" />
                      The Process
                    </p>
                    <h2 className="text-display-sm">How Investra works</h2>
                    <p className="text-body" style={{ marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
                      A coordinated pipeline of AI agents, each specialising in one dimension of investment research.
                    </p>
                  </div>
                </RevealOnScroll>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
                  {[
                    { step: "01", label: "Enter a company", desc: "Type any publicly traded company name or ticker symbol." },
                    { step: "02", label: "7 agents analyse", desc: "Financials, news, sentiment, competitors, risks — all in parallel." },
                    { step: "03", label: "Get your verdict", desc: "INVEST or PASS with a confidence score, target price, and full reasoning." },
                  ].map((item, i) => (
                    <RevealOnScroll key={item.step} direction="up" delay={i * 0.1}>
                      <div
                        className="card card-hover"
                        style={{ position: "relative", padding: "28px 24px" }}
                      >
                        <div
                          style={{
                            fontSize: 11, fontWeight: 800, color: "var(--primary)",
                            fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.1em",
                            marginBottom: 12, opacity: 0.6,
                          }}
                        >
                          STEP {item.step}
                        </div>
                        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
                          {item.label}
                        </h3>
                        <p className="text-body-sm">{item.desc}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </section>

            <div className="section-divider" aria-hidden="true" />

            {/* ── SEARCH TERMINAL ──────────────────────────────────────── */}
            <section
              id="research"
              aria-label="Research terminal"
              style={{
                padding: "88px 24px 80px",
                background: "var(--bg-base)",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Ambient glow */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
                  width: 600, height: 600, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <RevealOnScroll direction="up">
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                  <p className="eyebrow eyebrow-primary" style={{ marginBottom: 12 }}>
                    <span className="glow-dot glow-dot-blue" aria-hidden="true" />
                    AI Research Terminal
                  </p>
                  <h2 className="text-display-sm">What should we analyse today?</h2>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="scale" delay={0.1}>
                <div style={{ maxWidth: 680, margin: "0 auto" }}>
                  <SearchTerminal />
                </div>
              </RevealOnScroll>
            </section>

            <div className="section-divider" aria-hidden="true" />

            {/* ── BATTLE MODE + HISTORY ────────────────────────────────── */}
            <section
              aria-label="Battle mode and history"
              style={{ padding: "72px 24px 80px", background: "var(--bg-surface)", position: "relative" }}
            >
              <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                {/* Tab bar */}
                <div style={{ display: "flex", gap: 4, marginBottom: 36, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
                  {([
                    { id: "battle",  label: "⚔️ Battle Mode",   desc: "Compare companies" },
                    { id: "history", label: "📋 Recent Reports", desc: "Saved analyses" },
                  ] as const).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      aria-selected={activeTab === tab.id}
                      role="tab"
                      style={{
                        padding: "10px 20px",
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: 14, fontWeight: 600,
                        color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-tertiary)",
                        borderBottom: activeTab === tab.id ? "2px solid var(--primary)" : "2px solid transparent",
                        marginBottom: -1,
                        transition: "all var(--duration-fast) var(--ease-out)",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                  {activeTab === "battle"  && <BattleMode />}
                  {activeTab === "history" && <ReportHistory />}
                </div>
              </div>
            </section>

            <div className="section-divider" aria-hidden="true" />

            {/* ── FEATURE GRID ─────────────────────────────────────────── */}
            <section aria-label="Features" style={{ padding: "80px 24px 96px", background: "var(--bg-base)" }}>
              <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                <RevealOnScroll direction="up">
                  <div style={{ textAlign: "center", marginBottom: 52 }}>
                    <p className="eyebrow eyebrow-success" style={{ marginBottom: 12 }}>
                      <span className="glow-dot glow-dot-green" aria-hidden="true" />
                      Platform
                    </p>
                    <h2 className="text-display-sm">
                      Built like a{" "}
                      <span className="gradient-text">real product</span>
                    </h2>
                  </div>
                </RevealOnScroll>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {FEATURES.map(({ Icon, label, desc, color }, i) => (
                    <RevealOnScroll key={label} direction="up" delay={i * 0.06}>
                      <div
                        className="card card-hover"
                        style={{ borderLeft: `3px solid ${color}`, paddingLeft: 20 }}
                      >
                        <div
                          style={{
                            width: 40, height: 40, borderRadius: "var(--radius-md)",
                            background: `${color}18`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: 14,
                          }}
                        >
                          <Icon size={18} color={color} />
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>
                          {label}
                        </h3>
                        <p className="text-body-sm">{desc}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </section>

            {/* ── EXTENDED SECTIONS ────────────────────────────────────── */}
            <MoreFeatures />
            <Testimonials />
            <FAQ />

            <div className="section-divider" aria-hidden="true" />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
