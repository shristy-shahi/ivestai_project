"use client";
import { useState } from "react";
import { Swords, Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface BattleResult {
  winner: string; confidence: number; verdict: string;
  company1: { name: string; ticker: string; score: number; strengths: string[]; weaknesses: string[]; recommendation: string };
  company2: { name: string; ticker: string; score: number; strengths: string[]; weaknesses: string[]; recommendation: string };
  categories: Record<string, { winner: string; margin: number }>;
}

export default function BattleMode({ fullPage = false }: { fullPage?: boolean }) {
  const [c1, setC1] = useState(""); const [c2, setC2] = useState("");
  const [result, setResult] = useState<BattleResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    if (!c1.trim() || !c2.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company1: c1, company2: c2 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div
      style={{
        background: fullPage ? "transparent" : "var(--bg-surface)",
        border: fullPage ? "none" : "1px solid var(--border)",
        borderRadius: fullPage ? 0 : "var(--radius-lg)",
        padding: fullPage ? 0 : 24,
      }}
    >
      {/* Header (compact mode only) */}
      {!fullPage && (
        <div style={{ marginBottom: 20 }}>
          <p className="text-caption" style={{ marginBottom: 6 }}>Investment Battle Mode</p>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Which stock wins?</h3>
        </div>
      )}

      {/* VS Input row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <input
          value={c1}
          onChange={e => setC1(e.target.value)}
          onKeyDown={e => e.key === "Enter" && run()}
          placeholder="NVIDIA"
          aria-label="First company"
          className="input input-mono"
          style={{ color: "var(--primary)", textAlign: "center", fontWeight: 700 }}
        />
        <div
          aria-hidden="true"
          style={{
            fontSize: 16, fontWeight: 900, color: "var(--text-tertiary)",
            padding: "0 6px", display: "flex", alignItems: "center", gap: 4,
          }}
        >
          <Swords size={18} color="var(--text-tertiary)" />
        </div>
        <input
          value={c2}
          onChange={e => setC2(e.target.value)}
          onKeyDown={e => e.key === "Enter" && run()}
          placeholder="AMD"
          aria-label="Second company"
          className="input input-mono"
          style={{ color: "var(--warning)", textAlign: "center", fontWeight: 700 }}
        />
      </div>

      <button
        onClick={run}
        disabled={loading || !c1.trim() || !c2.trim()}
        className={`btn ${loading ? "btn-ghost" : "btn-primary"} btn-full`}
        aria-label={loading ? "Analysis in progress" : "Start battle analysis"}
      >
        {loading ? (
          <>
            <span className="spinner spinner-sm" />
            Analyzing…
          </>
        ) : (
          <>
            <Swords size={15} />
            Start Battle
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="alert alert-error" role="alert" style={{ marginTop: 12 }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ marginTop: 20 }} role="region" aria-label="Battle results">

          {/* Winner banner */}
          <div
            style={{
              textAlign: "center", padding: "20px 24px",
              background: "var(--success-dim)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: "var(--radius-lg)", marginBottom: 16,
            }}
          >
            <Trophy size={22} color="var(--success)" style={{ margin: "0 auto 8px" }} />
            <p className="text-caption" style={{ color: "var(--success)", marginBottom: 4 }}>Winner</p>
            <div style={{ fontSize: 28, fontWeight: 900, color: "var(--success)" }}>{result.winner}</div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
              {result.confidence}% confidence · {result.verdict}
            </p>
          </div>

          {/* Company cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[result.company1, result.company2].map((c, i) => {
              const isWinner = c.name === result.winner;
              return (
                <div
                  key={i}
                  style={{
                    padding: 16, borderRadius: "var(--radius-md)",
                    border: `1px solid ${isWinner ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                    background: isWinner ? "var(--success-dim)" : "var(--bg-elevated)",
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 2 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 12 }}>{c.ticker}</div>
                  <div
                    style={{
                      fontSize: 32, fontWeight: 900,
                      color: isWinner ? "var(--success)" : "var(--warning)",
                    }}
                    aria-label={`Score: ${c.score}`}
                  >
                    {c.score}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 600, marginBottom: 10 }}>SCORE</div>
                  {c.strengths.slice(0, 2).map((st, j) => (
                    <div key={j} style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 4, display: "flex", gap: 5 }}>
                      <TrendingUp size={11} color="var(--success)" style={{ flexShrink: 0, marginTop: 1 }} />
                      {st}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Category breakdown */}
          <div
            style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", overflow: "hidden",
            }}
          >
            {Object.entries(result.categories).map(([cat, val], i, arr) => (
              <div
                key={cat}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 16px",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--text-secondary)", textTransform: "capitalize" }}>{cat}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>{val.winner}</span>
                  <span
                    style={{
                      fontSize: 11, fontWeight: 700, color: "var(--success)",
                      background: "var(--success-dim)", border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: "var(--radius-full)", padding: "1px 7px",
                    }}
                  >
                    +{val.margin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
