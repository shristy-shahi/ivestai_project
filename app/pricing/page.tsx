"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Check, Zap, Sparkles, HelpCircle, ChevronDown } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const STARTER_FEATURES = [
  "3 AI research reports per month",
  "Basic financial charts",
  "News sentiment analysis",
  "Risk & competitor insights",
  "Report history (last 10)",
];

const PRO_FEATURES = [
  "Unlimited AI research reports",
  "Interactive RAG Report Chat",
  "Professional PDF exports",
  "Real-time live market charts",
  "Priority AI processing",
  "Full report history archive",
];

const COMPARE_ROWS = [
  { feature: "Monthly searches",   starter: "3",          pro: "Unlimited" },
  { feature: "Financial charts",   starter: "Basic",      pro: "Interactive + Live" },
  { feature: "PDF exports",        starter: false,        pro: true },
  { feature: "Report Chat (RAG)",  starter: false,        pro: true },
  { feature: "History archive",    starter: "10 reports", pro: "Unlimited" },
  { feature: "Battle Mode",        starter: true,         pro: true },
  { feature: "Priority processing",starter: false,        pro: true },
];

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes. Pro is billed monthly and you can cancel at any time from your account settings. No questions asked." },
  { q: "What payment methods are accepted?", a: "All major credit and debit cards via Stripe. Your payment info is never stored on our servers." },
  { q: "Does the free plan expire?", a: "No — your 3 free searches reset every calendar month and never expire." },
];

export default function PricingPage() {
  const { user, isAuthenticated, hydrated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCheckout = async (priceId: string) => {
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=/pricing`;
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err: any) {
      alert("Checkout error: " + err.message);
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar activePage="pricing" />

      {/* Hero */}
      <section
        aria-label="Pricing hero"
        style={{
          paddingTop: 120, paddingBottom: 64, paddingLeft: 24, paddingRight: 24,
          textAlign: "center",
          background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08) 0%, transparent 55%), var(--bg-base)",
        }}
      >
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.25)",
            borderRadius: "var(--radius-full)", color: "var(--accent)",
            fontSize: 13, fontWeight: 700, marginBottom: 24,
          }}
        >
          <Sparkles size={14} />
          Unlock AI Research
        </div>
        <h1 className="text-display-sm" style={{ marginBottom: 16 }}>
          Invest smarter,{" "}
          <span className="gradient-text-warm">not harder</span>
        </h1>
        <p className="text-body" style={{ maxWidth: 520, margin: "0 auto", fontSize: 17 }}>
          Get instant, institutional-grade AI analysis for any stock. Choose the plan that fits your investing journey.
        </p>
      </section>

      {/* Pricing Cards */}
      <section aria-label="Pricing plans" style={{ padding: "0 24px 80px" }}>
        <div
          style={{
            maxWidth: 860, margin: "0 auto",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20,
          }}
        >
          {/* Starter */}
          <div className="card" style={{ padding: 36 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Starter</h2>
              <p className="text-body-sm">Perfect for exploring AI-powered research.</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: "-0.03em" }}>$0</span>
              <span style={{ fontSize: 15, color: "var(--text-tertiary)", fontWeight: 400 }}> /month</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {STARTER_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                  <Check size={15} color="var(--success)" style={{ flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = "/"}
              className="btn btn-ghost btn-full"
              style={{ fontSize: 15, padding: "13px 20px" }}
            >
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div
            style={{
              position: "relative",
              background: "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.02) 100%)",
              border: "1px solid rgba(59,130,246,0.35)",
              borderRadius: "var(--radius-lg)",
              padding: 36,
              boxShadow: "var(--shadow-glow-primary)",
            }}
          >
            {/* Most popular chip */}
            <div
              style={{
                position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                color: "#fff", fontSize: 11, fontWeight: 800,
                padding: "4px 14px", borderRadius: "var(--radius-full)",
                letterSpacing: "0.06em", textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Most Popular
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: "var(--primary)" }}>
                Pro Investor
              </h2>
              <p className="text-body-sm">Everything you need for serious research.</p>
            </div>

            <div style={{ marginBottom: 28 }}>
              <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: "-0.03em" }}>$19</span>
              <span style={{ fontSize: 15, color: "var(--text-tertiary)", fontWeight: 400 }}> /month</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
              {PRO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-primary)" }}>
                  <Zap size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCheckout("price_pro")}
              disabled={loading}
              className="btn btn-primary btn-full"
              style={{ fontSize: 15, padding: "13px 20px" }}
              aria-label={loading ? "Processing payment" : "Upgrade to Pro plan"}
            >
              {loading ? "Processing…" : "Upgrade to Pro →"}
            </button>
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section aria-label="Plan comparison" style={{ padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 28, color: "var(--text-secondary)" }}>
            Full feature comparison
          </h2>

          <div
            className="card"
            style={{ overflow: "hidden", padding: 0 }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid", gridTemplateColumns: "1fr 120px 120px",
                background: "var(--bg-elevated)", padding: "14px 24px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Feature</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Starter</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Pro</span>
            </div>

            {COMPARE_ROWS.map((row, i) => (
              <div
                key={i}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 120px 120px",
                  padding: "14px 24px", alignItems: "center",
                  borderBottom: i < COMPARE_ROWS.length - 1 ? "1px solid var(--border)" : "none",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{row.feature}</span>
                <span style={{ textAlign: "center" }}>
                  {typeof row.starter === "boolean" ? (
                    row.starter
                      ? <Check size={16} color="var(--success)" />
                      : <span style={{ fontSize: 18, color: "var(--text-tertiary)" }}>—</span>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{row.starter}</span>
                  )}
                </span>
                <span style={{ textAlign: "center" }}>
                  {typeof row.pro === "boolean" ? (
                    row.pro
                      ? <Check size={16} color="var(--success)" />
                      : <span style={{ fontSize: 18, color: "var(--text-tertiary)" }}>—</span>
                  ) : (
                    <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>{row.pro}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-label="Pricing FAQ" style={{ padding: "0 24px 96px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 28, color: "var(--text-secondary)" }}>
            Common questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="card"
                  style={{ overflow: "hidden", padding: 0 }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 20px", background: "none", border: "none", cursor: "pointer",
                      textAlign: "left", gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <HelpCircle size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 15, fontWeight: 600, color: isOpen ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      color="var(--text-tertiary)"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.25s ease", flexShrink: 0 }}
                    />
                  </button>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65, padding: "0 20px 18px 46px" }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
