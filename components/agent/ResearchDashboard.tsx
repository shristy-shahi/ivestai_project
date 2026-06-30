"use client";
import { useResearchStore } from "@/stores/useResearchStore";
import { RevenueChart, ProfitChart, RiskRadar } from "@/components/charts/FinancialCharts";
import StockChart from "@/components/charts/StockChart";
import RecommendationCard from "./RecommendationCard";
import AgentGraph from "./AgentGraph";
import ReportChat from "./ReportChat";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { Download, TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";

/* ── Shared card style ────────────────────────────────────────── */
const sectionCard: React.CSSProperties = {
  background: "var(--bg-surface)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-lg)",
  padding: 24,
};

export default function ResearchDashboard() {
  const { state, isLoading, currentStep, completedSteps, error, reset } = useResearchStore();
  if (!state && !isLoading && !error) return null;
  const s = state;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start" }}>

        {/* ── Left: sticky pipeline ── */}
        <div style={{ position: "sticky", top: 80 }}>
          <AgentGraph currentStep={currentStep} completedSteps={completedSteps} />
        </div>

        {/* ── Right: output ── */}
        <div id="report-content" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Error state */}
          {error && (
            <div
              role="alert"
              style={{
                ...sectionCard,
                borderColor: "rgba(244,63,94,0.3)",
                background: "var(--danger-dim)",
                textAlign: "center", padding: 48,
              }}
            >
              <AlertCircle size={44} color="var(--danger)" style={{ margin: "0 auto 16px" }} />
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--danger)", marginBottom: 8 }}>Analysis Failed</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20, maxWidth: 460, margin: "0 auto 20px", lineHeight: 1.65 }}>
                {error.includes("quota") || error.includes("insufficient") ? (
                  <>
                    Your API key has run out of credits or hit a rate limit.
                    <br />Get a free Gemini key at{" "}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank" rel="noopener noreferrer"
                      style={{ color: "var(--warning)", textDecoration: "underline" }}
                    >
                      aistudio.google.com
                    </a>{" "}
                    and add it to your{" "}
                    <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>.env</code>
                  </>
                ) : error}
              </p>
              <button
                onClick={() => reset()}
                className="btn btn-ghost"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && !s?.companyData && (
            <div style={{ ...sectionCard, textAlign: "center", padding: 48 }}>
              <div style={{ position: "relative", width: 56, height: 56, margin: "0 auto 20px" }}>
                <div className="spinner spinner-lg" style={{ position: "absolute", inset: 0 }} />
                <div style={{
                  position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20
                }}>🔍</div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                Analyst Workspace
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
                Running research pipeline for{" "}
                <strong style={{ color: "var(--primary)" }}>{state?.company}</strong>…
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, textAlign: "left", maxWidth: 260, margin: "0 auto" }}>
                {["Reading Financial Statements", "Checking News Sources", "Evaluating Risks", "Comparing Competitors", "Building Recommendation"].map((item, i) => (
                  <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", gap: 8, alignItems: "center" }}>
                    <span className="glow-dot glow-dot-blue" style={{ flexShrink: 0 }} aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company header */}
          {s?.companyData && (
            <div style={{ ...sectionCard, display: "flex", alignItems: "center", gap: 20 }}>
              <img
                src={s.companyData.logoUrl}
                alt={`${s.companyData.name} logo`}
                style={{
                  width: 64, height: 64, borderRadius: "var(--radius-md)", objectFit: "contain",
                  background: "var(--bg-elevated)", padding: 8, flexShrink: 0,
                }}
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${s.companyData?.ticker}&size=64&background=3B82F6&color=fff&bold=true`;
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
                  {s.companyData.name}
                </h1>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <span
                    className="font-mono badge badge-primary"
                    style={{ fontSize: 13, fontWeight: 700 }}
                  >
                    {s.ticker}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{s.companyData.industry}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>·</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--success)" }}>{s.companyData.marketCap}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.6 }}>
                  {s.companyData.description}
                </p>
              </div>

              {/* PDF Export */}
              <button
                onClick={async () => {
                  const html2pdf = (await import("html2pdf.js")).default;
                  const element = document.getElementById("report-content");
                  if (!element) return;
                  const opt = {
                    margin: 0.5,
                    filename: `${s.ticker}_Investment_Report.pdf`,
                    image: { type: "jpeg" as const, quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#070B14" },
                    jsPDF: { unit: "in" as const, format: "letter" as const, orientation: "portrait" as const },
                  };
                  html2pdf().set(opt).from(element).save();
                }}
                className="btn btn-ghost btn-sm hide-on-pdf"
                aria-label="Export report as PDF"
                style={{ flexShrink: 0 }}
              >
                <Download size={14} />
                PDF
              </button>
            </div>
          )}

          {/* Key metrics */}
          {s?.financialData && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {[
                  { label: "P/E Ratio",    value: `${s.financialData.peRatio.toFixed(1)}×` },
                  { label: "EPS",          value: `$${s.financialData.eps.toFixed(2)}` },
                  { label: "Op. Margin",   value: `${s.financialData.operatingMargin.toFixed(1)}%` },
                  { label: "D/E Ratio",    value: `${s.financialData.debtToEquity.toFixed(2)}×` },
                ].map(m => (
                  <MetricCard key={m.label} label={m.label} value={m.value} />
                ))}
              </div>

              {/* Live stock chart */}
              <div style={sectionCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span className="text-caption">Market Performance (1 Year)</span>
                  <Badge variant="primary" dot>Live Data</Badge>
                </div>
                <StockChart ticker={s.ticker} />
              </div>

              {/* Revenue + Profit charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <RevenueChart data={s.financialData} />
                <ProfitChart  data={s.financialData} />
              </div>
            </>
          )}

          {/* Sentiment */}
          {s?.sentiment && (
            <div style={sectionCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span className="text-caption" style={{ display: "block", marginBottom: 4 }}>Market Sentiment</span>
                  <div
                    style={{
                      fontSize: 22, fontWeight: 800, marginTop: 4,
                      color: s.sentiment.label === "Bullish" ? "var(--success)" : s.sentiment.label === "Bearish" ? "var(--danger)" : "var(--warning)",
                    }}
                  >
                    {s.sentiment.label} · {s.sentiment.score}/100
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6, lineHeight: 1.6 }}>
                    {s.sentiment.summary}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 16 }}>
                  {[
                    { label: "Pos", count: s.sentiment.positiveCount, color: "var(--success)" },
                    { label: "Neu", count: s.sentiment.neutralCount,  color: "var(--warning)" },
                    { label: "Neg", count: s.sentiment.negativeCount, color: "var(--danger)" },
                  ].map(b => (
                    <div key={b.label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>{b.count}</div>
                      <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 600 }}>{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Score bar */}
              <div className="progress-track" style={{ marginBottom: 14 }}>
                <div className="progress-fill" style={{ width: `${s.sentiment.score}%` }} />
              </div>

              {/* Themes */}
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {s.sentiment.keyThemes.map(t => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* News */}
          {s?.newsData && s.newsData.length > 0 && (
            <div style={sectionCard}>
              <h3 className="text-caption" style={{ marginBottom: 16 }}>News Timeline</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {s.newsData.map((n, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px",
                      background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
                      borderLeft: `3px solid ${n.sentiment === "positive" ? "var(--success)" : n.sentiment === "negative" ? "var(--danger)" : "var(--border)"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>
                        {n.title}
                      </span>
                      <Badge
                        variant={n.sentiment === "positive" ? "invest" : n.sentiment === "negative" ? "pass" : "neutral"}
                      >
                        {n.sentiment}
                      </Badge>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 5 }}>
                      {n.source} · {n.date}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 5, lineHeight: 1.55 }}>
                      {n.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitors */}
          {s?.competitors && s.competitors.length > 0 && (
            <div style={sectionCard}>
              <h3 className="text-caption" style={{ marginBottom: 16 }}>Competitor Analysis</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {s.competitors.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 16, background: "var(--bg-elevated)", borderRadius: "var(--radius-md)",
                      textAlign: "center", border: "1px solid var(--border)",
                    }}
                  >
                    <img
                      src={c.logoUrl}
                      alt={`${c.name} logo`}
                      style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", objectFit: "contain", background: "var(--bg-overlay)", padding: 4, margin: "0 auto 8px" }}
                      onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${c.ticker}&size=40&background=374151&color=fff&bold=true`; }}
                    />
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }}>
                      {c.ticker} · {c.marketCap}
                    </div>
                    <div
                      style={{
                        fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                        color: c.revenueGrowth >= 0 ? "var(--success)" : "var(--danger)",
                      }}
                    >
                      {c.revenueGrowth >= 0
                        ? <TrendingUp size={13} />
                        : <TrendingDown size={13} />
                      }
                      {Math.abs(c.revenueGrowth)}% growth
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 6, lineHeight: 1.5 }}>{c.advantage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk radar + factors */}
          {s?.risks && (
            <>
              <RiskRadar data={s.risks} />
              <div style={sectionCard}>
                <h3 className="text-caption" style={{ marginBottom: 16 }}>Risk Factors</h3>
                {s.risks.factors.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", marginBottom: 8,
                      borderLeft: `3px solid ${f.severity === "high" ? "var(--danger)" : f.severity === "medium" ? "var(--warning)" : "var(--success)"}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{f.category}</span>
                      <Badge variant={f.severity === "high" ? "pass" : f.severity === "medium" ? "warning" : "invest"}>
                        {f.severity}
                      </Badge>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.55 }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Final verdict */}
          {s?.recommendation && s.companyData && (
            <RecommendationCard recommendation={s.recommendation} company={s.companyData} score={s.score ?? 0} />
          )}
        </div>
      </div>

      <ReportChat />
    </div>
  );
}
