"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import MetricCard from "@/components/ui/MetricCard";
import Badge from "@/components/ui/Badge";
import { Search, TrendingUp, TrendingDown, FileText, ArrowRight, BarChart2 } from "lucide-react";

interface HistoryItem {
  id: string;
  company_name: string;
  ticker: string;
  recommendation: "INVEST" | "PASS";
  score: number;
  created_at: string;
}

type FilterType = "all" | "INVEST" | "PASS";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const url = user?.uid
      ? `/api/history?userId=${encodeURIComponent(user.uid)}`
      : "/api/history";
    fetch(url)
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d); })
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const filtered = history.filter(h => {
    const matchFilter = filter === "all" || h.recommendation === filter;
    const matchSearch =
      h.company_name.toLowerCase().includes(search.toLowerCase()) ||
      h.ticker.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const investCount = history.filter(h => h.recommendation === "INVEST").length;
  const passCount   = history.filter(h => h.recommendation === "PASS").length;
  const avgScore    = history.length > 0
    ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
    : 0;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar activePage="history" />

      <main style={{ maxWidth: 940, margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          <p className="eyebrow eyebrow-primary" style={{ marginBottom: 10 }}>
            <span className="glow-dot glow-dot-blue" aria-hidden="true" />
            Research Archive
          </p>
          <h1 className="text-display-sm" style={{ marginBottom: 8 }}>Report History</h1>
          <p className="text-body">All your AI-generated investment reports, saved to Supabase.</p>
        </header>

        {/* Stats */}
        {!loading && history.length > 0 && (
          <div
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}
            aria-label="Summary statistics"
          >
            <MetricCard label="Total Reports" value={history.length} color="var(--text-primary)" />
            <MetricCard label="Invest" value={investCount} color="var(--success)" />
            <MetricCard label="Pass"  value={passCount}   color="var(--danger)" />
            <MetricCard label="Avg Score" value={avgScore} color="var(--warning)" />
          </div>
        )}

        {/* Filters */}
        <div
          role="search"
          aria-label="Filter reports"
          style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}
        >
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <Search
              size={14}
              color="var(--text-tertiary)"
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company or ticker…"
              aria-label="Search by company name or ticker"
              className="input"
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div role="group" aria-label="Filter by recommendation" style={{ display: "flex", gap: 6 }}>
            {(["all", "INVEST", "PASS"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`btn btn-sm ${filter === f ? (f === "INVEST" ? "btn-success" : f === "PASS" ? "btn-danger" : "btn-primary") : "btn-ghost"}`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div
            style={{ textAlign: "center", padding: "64px 0" }}
            role="status"
            aria-label="Loading reports"
          >
            <div className="spinner spinner-lg" style={{ margin: "0 auto 16px" }} />
            <p className="text-body-sm">Loading reports…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="card"
            style={{ textAlign: "center", padding: "60px 24px" }}
            role="status"
          >
            <div
              style={{
                width: 64, height: 64, borderRadius: "var(--radius-xl)",
                background: "var(--bg-elevated)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              {history.length === 0
                ? <BarChart2 size={28} color="var(--text-tertiary)" />
                : <Search size={28} color="var(--text-tertiary)" />
              }
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              {history.length === 0 ? "No reports yet" : "No matching reports"}
            </h2>
            <p className="text-body-sm">
              {history.length === 0
                ? "Run your first analysis from the home page."
                : "Try a different search term or filter."}
            </p>
            {history.length === 0 && (
              <a href="/" className="btn btn-primary" style={{ textDecoration: "none", marginTop: 20, display: "inline-flex" }}>
                Start Analysing →
              </a>
            )}
          </div>
        ) : (
          <div
            role="list"
            aria-label={`${filtered.length} reports`}
            style={{ display: "flex", flexDirection: "column", gap: 8 }}
          >
            {filtered.map((h, i) => (
              <a
                key={h.id}
                href={`/report?id=${h.id}`}
                role="listitem"
                aria-label={`${h.company_name} (${h.ticker}) — ${h.recommendation}, score ${h.score}`}
                className="card card-hover"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  textDecoration: "none", gap: 16,
                  animation: `slide-up 0.35s var(--ease-spring) ${i * 0.04}s both`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* Verdict icon */}
                  <div
                    style={{
                      width: 42, height: 42, borderRadius: "var(--radius-md)", flexShrink: 0,
                      background: h.recommendation === "INVEST" ? "var(--success-dim)" : "var(--danger-dim)",
                      border: `1px solid ${h.recommendation === "INVEST" ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    {h.recommendation === "INVEST"
                      ? <TrendingUp size={18} color="var(--success)" />
                      : <TrendingDown size={18} color="var(--danger)" />
                    }
                  </div>

                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>
                      {h.company_name}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontFamily: "monospace", color: "var(--primary)", fontWeight: 600 }}>
                        {h.ticker}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                        {new Date(h.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  {/* Score */}
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 22, fontWeight: 900, lineHeight: 1,
                        color: h.score >= 60 ? "var(--success)" : h.score >= 40 ? "var(--warning)" : "var(--danger)",
                      }}
                    >
                      {h.score}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 600, marginTop: 1 }}>SCORE</div>
                  </div>

                  <Badge variant={h.recommendation === "INVEST" ? "invest" : "pass"}>
                    {h.recommendation}
                  </Badge>

                  <ArrowRight size={16} color="var(--text-tertiary)" aria-hidden="true" />
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
