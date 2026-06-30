"use client";
import React, { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import { ChevronDown, Zap, Shield, TrendingUp, Star } from "lucide-react";

/* ── More Features Section ──────────────────────────────────────── */
export function MoreFeatures() {
  const features = [
    {
      Icon: Zap, color: "var(--primary)",
      title: "Lightning Fast Analysis",
      desc: "Our 7-agent pipeline processes thousands of data points in under 60 seconds — faster than any human analyst.",
      stat: "< 60s",
    },
    {
      Icon: Shield, color: "var(--success)",
      title: "Institutional-Grade Data",
      desc: "We pull from premium financial APIs to ensure accuracy and real-time relevance in every report.",
      stat: "7 APIs",
    },
    {
      Icon: TrendingUp, color: "var(--warning)",
      title: "Live Market Charts",
      desc: "Visualise historical stock performance alongside AI recommendations for context.",
      stat: "1Y data",
    },
  ];

  return (
    <section
      aria-labelledby="more-features-heading"
      style={{ padding: "80px 24px", background: "var(--bg-surface)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className="eyebrow eyebrow-primary" style={{ marginBottom: 12 }}>
              <span className="glow-dot glow-dot-blue" aria-hidden="true" />
              Capabilities
            </p>
            <h2 id="more-features-heading" className="text-display-sm">
              Everything you need to{" "}
              <span className="gradient-text">trade smarter</span>
            </h2>
            <p className="text-body" style={{ marginTop: 12, maxWidth: 480, margin: "12px auto 0" }}>
              We've packed Investra with features designed for the modern investor.
            </p>
          </div>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <RevealOnScroll key={i}>
              <div
                className="card card-hover"
                style={{ padding: "28px 24px", height: "100%" }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: "var(--radius-md)",
                    background: `${f.color}1A`, border: `1px solid ${f.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}
                >
                  <f.Icon size={22} color={f.color} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
                    {f.title}
                  </h3>
                  <span
                    style={{
                      fontSize: 13, fontWeight: 800, color: f.color,
                      background: `${f.color}1A`, border: `1px solid ${f.color}25`,
                      borderRadius: "var(--radius-full)", padding: "2px 10px", flexShrink: 0, marginLeft: 8,
                    }}
                  >
                    {f.stat}
                  </span>
                </div>
                <p className="text-body-sm">{f.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials Section ───────────────────────────────────────── */
export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah J.", role: "Retail Investor", initials: "SJ",
      content: "Investra's AI completely changed how I research stocks. It caught risks in my portfolio I never would have seen.",
      rating: 5,
    },
    {
      name: "Michael T.", role: "Day Trader", initials: "MT",
      content: "The real-time sentiment analysis and competitor comparison saves me hours every week. Absolutely worth the Pro upgrade.",
      rating: 5,
    },
    {
      name: "Elena R.", role: "Financial Analyst", initials: "ER",
      content: "I use the PDF exports for my client briefs. The institutional-grade analysis is spot on and beautifully presented.",
      rating: 5,
    },
  ];

  const avatarColors = ["var(--primary)", "var(--success)", "var(--accent)"];

  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ padding: "80px 24px", background: "var(--bg-base)" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="eyebrow eyebrow-warning" style={{ marginBottom: 12 }}>
              <span className="glow-dot glow-dot-amber" aria-hidden="true" />
              Social Proof
            </p>
            <h2 id="testimonials-heading" className="text-display-sm">
              Loved by investors worldwide
            </h2>
            <p className="text-body" style={{ marginTop: 12 }}>Don't just take our word for it.</p>
          </div>
        </RevealOnScroll>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i}>
              <article
                className="card card-hover"
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }} aria-label={`${t.rating} out of 5 stars`}>
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} color="var(--warning)" fill="var(--warning)" aria-hidden="true" />
                  ))}
                </div>

                <blockquote style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7,
                      marginBottom: 20, fontStyle: "italic",
                    }}
                  >
                    "{t.content}"
                  </p>
                </blockquote>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: "50%",
                      background: `${avatarColors[i]}22`,
                      border: `1px solid ${avatarColors[i]}40`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, color: avatarColors[i],
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{t.role}</div>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FAQ Section ────────────────────────────────────────────────── */
export function FAQ() {
  const faqs = [
    {
      q: "How accurate is the AI recommendation?",
      a: "Investra uses a multi-agent architecture (LangGraph) powered by Gemini 2.5 Flash. It cross-references financial data, live news, and competitor analysis. However, it is not financial advice and should be used as a research tool alongside your own judgment.",
    },
    {
      q: "What data sources do you use?",
      a: "We aggregate real-time data from premium financial APIs and news outlets. The AI synthesises this into a structured report across 7 categories.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes! Your account comes with 3 free AI searches every month. You can upgrade to the Pro tier for unlimited searches and premium features.",
    },
    {
      q: "Can I export the reports?",
      a: "Yes — Pro users can download professional, paginated PDF exports of any analysis for offline viewing or sharing with clients.",
    },
    {
      q: "Is my data safe?",
      a: "Reports are stored securely in Supabase (PostgreSQL). We do not sell or share your research data with third parties.",
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="faq-heading"
      style={{ padding: "80px 24px", background: "var(--bg-surface)" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <RevealOnScroll>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="eyebrow eyebrow-primary" style={{ marginBottom: 12 }}>
              <span className="glow-dot glow-dot-blue" aria-hidden="true" />
              Questions
            </p>
            <h2 id="faq-heading" className="text-display-sm">Frequently Asked</h2>
          </div>
        </RevealOnScroll>

        <div role="list" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <RevealOnScroll key={i}>
                <div
                  role="listitem"
                  className="card"
                  style={{ overflow: "hidden", padding: 0 }}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "20px 22px", background: "none", border: "none",
                      cursor: "pointer", textAlign: "left", gap: 12,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 15, fontWeight: 600, margin: 0,
                        color: isOpen ? "var(--text-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {faq.q}
                    </h3>
                    <ChevronDown
                      size={17}
                      color="var(--text-tertiary)"
                      aria-hidden="true"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s ease",
                        flexShrink: 0,
                      }}
                    />
                  </button>

                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s ease",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7,
                          margin: 0, padding: "0 22px 20px",
                        }}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
