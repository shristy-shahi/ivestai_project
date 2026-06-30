"use client";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase/client";
import type { AgentState, Recommendation, CompanyData, FinancialData, SentimentData, Competitor, RiskData } from "@/lib/types";
import { RevenueChart, ProfitChart, RiskRadar } from "@/components/charts/FinancialCharts";

/* ── helpers ─────────────────────────────────────────────────────── */
const C = {
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
  } as React.CSSProperties,
  label: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  title: { fontSize: 26, fontWeight: 800, color: "#f9fafb" },
  sub: { fontSize: 13, color: "#9ca3af" },
  body: { fontSize: 13, color: "#d1d5db", lineHeight: 1.6 },
};

function VerdictBadge({ decision, confidence }: { decision: "INVEST" | "PASS"; confidence: number }) {
  const isInvest = decision === "INVEST";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 12,
      padding: "14px 28px", borderRadius: 14,
      background: isInvest ? "linear-gradient(135deg,rgba(6,214,160,0.15),rgba(0,209,178,0.1))" : "linear-gradient(135deg,rgba(239,71,111,0.15),rgba(239,71,111,0.08))",
      border: `1px solid ${isInvest ? "rgba(6,214,160,0.35)" : "rgba(239,71,111,0.35)"}`,
      boxShadow: isInvest ? "0 0 32px rgba(6,214,160,0.15)" : "0 0 32px rgba(239,71,111,0.15)",
    }}>
      <span style={{ fontSize: 32 }}>{isInvest ? "✅" : "🚫"}</span>
      <div>
        <div style={{ fontSize: 28, fontWeight: 900, color: isInvest ? "#06d6a0" : "#ef476f", lineHeight: 1 }}>
          {decision}
        </div>
        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
          {confidence}% confidence
        </div>
      </div>
    </div>
  );
}

/* ── Report page ─────────────────────────────────────────────────── */
interface ReportRow {
  id: string;
  company_name: string;
  ticker: string;
  recommendation: "INVEST" | "PASS";
  score: number;
  created_at: string;
  analysis: AgentState;
}

export default function ReportPage() {
  const [report, setReport] = useState<ReportRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
      setError("No report ID provided. Add ?id=<report-id> to the URL.");
      setLoading(false);
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("your_")) {
      setError("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.");
      setLoading(false);
      return;
    }

    const db = getSupabase();
    db.from("reports").select("*").eq("id", id).single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError(err?.message ?? "Report not found.");
        } else {
          setReport(data as ReportRow);
        }
        setLoading(false);
      });
  }, []);

  /* ── Loading ──────────────────────────────────────────────────── */
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: "blink 1.5s ease-in-out infinite" }}>📋</div>
        <div style={{ color: "#9ca3af", fontSize: 16 }}>Loading report…</div>
      </div>
    </div>
  );

  /* ── Error ────────────────────────────────────────────────────── */
  if (error || !report) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ ...C.card, maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f9fafb", marginBottom: 8 }}>Report Unavailable</div>
        <div style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.6 }}>{error}</div>
        <a href="/" style={{
          display: "inline-block", marginTop: 20, padding: "10px 24px",
          background: "linear-gradient(135deg,#ff6b35,#ffd166)", color: "#0a0a0f",
          borderRadius: 10, fontWeight: 700, textDecoration: "none", fontSize: 14,
        }}>← Back to Investra</a>
      </div>
    </div>
  );

  const s = report.analysis;
  const rec = s?.recommendation as Recommendation | null;
  const co = s?.companyData as CompanyData | null;
  const fi = s?.financialData as FinancialData | null;
  const se = s?.sentiment as SentimentData | null;
  const ri = s?.risks as RiskData | null;
  const comps = s?.competitors as Competitor[] ?? [];
  const news = s?.newsData ?? [];

  const date = new Date(report.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#f9fafb" }}>

      {/* ── Nav ──────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,10,15,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 28px",
      }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg,#ff6b35,#ffd166)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            boxShadow: "0 0 12px rgba(255,107,53,0.3)",
          }}>📈</div>
          <span style={{ fontSize: 18, fontWeight: 900, color: "white" }}>Investra</span>
          <span style={{
            fontSize: 10, fontWeight: 700, background: "#ff6b35", color: "white",
            borderRadius: 5, padding: "2px 7px", letterSpacing: "0.06em",
          }}>AI</span>
        </a>
        <div style={{ fontSize: 12, color: "#4b5563" }}>
          Report · {date}
        </div>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href); }}
          style={{
            padding: "6px 16px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#9ca3af",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,107,53,0.1)";
            e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
            e.currentTarget.style.color = "#ff6b35";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "#9ca3af";
          }}
        >🔗 Copy Link</button>
      </nav>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 20px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Header */}
        <div style={{ ...C.card }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
            {co && (
              <img
                src={co.logoUrl}
                alt={co.name}
                style={{ width: 72, height: 72, borderRadius: 16, objectFit: "contain", background: "rgba(255,255,255,0.06)", padding: 10, flexShrink: 0 }}
                onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${co.ticker}&size=72&background=FF6B35&color=fff&bold=true`; }}
              />
            )}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={C.title}>{co?.name ?? report.company_name}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#ff6b35", fontFamily: "monospace" }}>{report.ticker}</span>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
                {co?.industry && <span style={C.sub}>{co.industry}</span>}
                {co?.sector && <><span style={{ color: "#374151" }}>·</span><span style={C.sub}>{co.sector}</span></>}
                {co?.marketCap && <><span style={{ color: "#374151" }}>·</span><span style={{ fontSize: 13, fontWeight: 700, color: "#00d1b2" }}>{co.marketCap}</span></>}
              </div>
              {co?.description && <div style={{ ...C.body, marginTop: 10 }}>{co.description}</div>}
            </div>
            {rec && (
              <div style={{ flexShrink: 0 }}>
                <VerdictBadge decision={rec.decision} confidence={rec.confidence} />
              </div>
            )}
          </div>

          {/* Company detail pills */}
          {co && (
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              {[
                { label: "CEO", value: co.ceo },
                { label: "Founded", value: co.founded },
                { label: "HQ", value: co.headquarters },
                { label: "Employees", value: co.employees },
              ].map(d => (
                <div key={d.label} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, padding: "6px 14px",
                }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#f9fafb", marginTop: 1 }}>{d.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Score bar */}
        <div style={{ ...C.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={C.label}>Investment Score</span>
            <span style={{ fontSize: 22, fontWeight: 900, color: report.score >= 60 ? "#06d6a0" : report.score >= 40 ? "#ffd166" : "#ef476f" }}>
              {report.score}/100
            </span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              width: `${report.score}%`, height: "100%", borderRadius: 8,
              background: report.score >= 60
                ? "linear-gradient(90deg,#06d6a0,#00d1b2)"
                : report.score >= 40
                  ? "linear-gradient(90deg,#ff6b35,#ffd166)"
                  : "linear-gradient(90deg,#ef476f,#ff6b35)",
              transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Financial metrics */}
        {fi && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
              {[
                { label: "Revenue", value: `$${fi.revenue.toFixed(1)}B` },
                { label: "Rev Growth", value: `${fi.revenueGrowth > 0 ? "+" : ""}${fi.revenueGrowth}%`, color: fi.revenueGrowth >= 0 ? "#06d6a0" : "#ef476f" },
                { label: "Net Income", value: `$${fi.netIncome.toFixed(1)}B` },
                { label: "P/E Ratio", value: `${fi.peRatio.toFixed(1)}x` },
                { label: "EPS", value: `$${fi.eps.toFixed(2)}` },
                { label: "Op. Margin", value: `${fi.operatingMargin.toFixed(1)}%` },
                { label: "D/E Ratio", value: `${fi.debtToEquity.toFixed(2)}x` },
                { label: "ROE", value: `${fi.roe.toFixed(1)}%` },
              ].map(m => (
                <div key={m.label} style={{ ...C.card, textAlign: "center", padding: "16px 12px" }}>
                  <div style={C.label}>{m.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: (m as any).color ?? "#f9fafb", marginTop: 6 }}>{m.value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <RevenueChart data={fi} />
              <ProfitChart data={fi} />
            </div>
          </>
        )}

        {/* Sentiment */}
        {se && (
          <div style={C.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={C.label}>Market Sentiment</div>
                <div style={{
                  fontSize: 24, fontWeight: 800, marginTop: 4,
                  color: se.label === "Bullish" ? "#06d6a0" : se.label === "Bearish" ? "#ef476f" : "#ffd166",
                }}>
                  {se.label} · {se.score}/100
                </div>
                <div style={{ ...C.body, marginTop: 6 }}>{se.summary}</div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { label: "Positive", count: se.positiveCount, color: "#06d6a0" },
                  { label: "Neutral", count: se.neutralCount, color: "#ffd166" },
                  { label: "Negative", count: se.negativeCount, color: "#ef476f" },
                ].map(b => (
                  <div key={b.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>{b.count}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ width: `${se.score}%`, height: "100%", background: "linear-gradient(90deg,#ff6b35,#00d1b2)", borderRadius: 4 }} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {se.keyThemes.map(t => (
                <span key={t} style={{ background: "rgba(255,255,255,0.06)", color: "#d1d5db", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* News */}
        {news.length > 0 && (
          <div style={C.card}>
            <div style={{ ...C.label, marginBottom: 16 }}>News Timeline</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {news.map((n, i) => (
                <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" style={{
                  padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10,
                  borderLeft: `3px solid ${n.sentiment === "positive" ? "#06d6a0" : n.sentiment === "negative" ? "#ef476f" : "#374151"}`,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f9fafb", lineHeight: 1.4 }}>{n.title}</div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0,
                      background: n.sentiment === "positive" ? "rgba(6,214,160,0.15)" : n.sentiment === "negative" ? "rgba(239,71,111,0.15)" : "rgba(255,255,255,0.06)",
                      color: n.sentiment === "positive" ? "#06d6a0" : n.sentiment === "negative" ? "#ef476f" : "#9ca3af",
                      border: `1px solid ${n.sentiment === "positive" ? "rgba(6,214,160,0.3)" : n.sentiment === "negative" ? "rgba(239,71,111,0.3)" : "rgba(255,255,255,0.1)"}`,
                    }}>{n.sentiment}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{n.source} · {n.date}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, lineHeight: 1.5 }}>{n.summary}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Competitors */}
        {comps.length > 0 && (
          <div style={C.card}>
            <div style={{ ...C.label, marginBottom: 16 }}>Competitor Analysis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              {comps.map((c, i) => (
                <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.03)", borderRadius: 12, textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={c.logoUrl} alt={c.name}
                    style={{ width: 40, height: 40, borderRadius: 8, objectFit: "contain", background: "rgba(255,255,255,0.06)", padding: 4, margin: "0 auto 8px" }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${c.ticker}&size=40&background=374151&color=fff&bold=true`; }}
                  />
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#f9fafb" }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 8px" }}>{c.ticker} · {c.marketCap}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.revenueGrowth >= 0 ? "#06d6a0" : "#ef476f" }}>
                    {c.revenueGrowth >= 0 ? "▲" : "▼"} {Math.abs(c.revenueGrowth)}% growth
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 6, lineHeight: 1.4 }}>{c.advantage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk */}
        {ri && (
          <>
            <RiskRadar data={ri} />
            <div style={C.card}>
              <div style={{ ...C.label, marginBottom: 16 }}>Risk Factors</div>
              {ri.factors.map((f, i) => (
                <div key={i} style={{
                  padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, marginBottom: 8,
                  borderLeft: `3px solid ${f.severity === "high" ? "#ef476f" : f.severity === "medium" ? "#ffd166" : "#06d6a0"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f9fafb" }}>{f.category}</div>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 700, textTransform: "capitalize",
                      background: f.severity === "high" ? "rgba(239,71,111,0.15)" : f.severity === "medium" ? "rgba(255,209,102,0.15)" : "rgba(6,214,160,0.15)",
                      color: f.severity === "high" ? "#ef476f" : f.severity === "medium" ? "#ffd166" : "#06d6a0",
                    }}>{f.severity}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4, lineHeight: 1.5 }}>{f.description}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Final verdict */}
        {rec && (
          <div style={{ ...C.card, border: `1px solid ${rec.decision === "INVEST" ? "rgba(6,214,160,0.25)" : "rgba(239,71,111,0.25)"}` }}>
            <div style={C.label}>Final Investment Verdict</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <VerdictBadge decision={rec.decision} confidence={rec.confidence} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 15, color: "#d1d5db", lineHeight: 1.65 }}>{rec.verdict}</div>
                {rec.analystNote && (
                  <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, borderLeft: "2px solid #ff6b35" }}>
                    <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, marginBottom: 4 }}>ANALYST NOTE</div>
                    <div style={{ fontSize: 13, color: "#9ca3af" }}>{rec.analystNote}</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
              {/* Bull case */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#06d6a0", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ▲ Bull Case — Reasons to Invest
                </div>
                {rec.investReasons.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#06d6a0", flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
              {/* Bear case */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ef476f", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  ▼ Bear Case — Reasons to Pass
                </div>
                {rec.passReasons.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ color: "#ef476f", flexShrink: 0, marginTop: 1 }}>✗</span>
                    <span style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af", borderRadius: 20, padding: "4px 12px", fontSize: 12 }}>
                ⏱ {rec.timeHorizon.charAt(0).toUpperCase() + rec.timeHorizon.slice(1)}-term horizon
              </span>
              {rec.targetPrice && (
                <span style={{ background: "rgba(0,209,178,0.1)", color: "#00d1b2", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                  🎯 Target Price: ${rec.targetPrice}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "24px 0 8px", color: "#374151", fontSize: 12 }}>
          Report generated by Investra AI · {date} · Not financial advice
        </div>
      </div>
    </div>
  );
}
