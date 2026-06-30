"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Badge from "@/components/ui/Badge";
import { TrendingUp, TrendingDown, ArrowRight, Lock, BarChart2 } from "lucide-react";

interface HistoryItem {
  id: string;
  company_name: string;
  ticker: string;
  recommendation: "INVEST" | "PASS";
  score: number;
  created_at: string;
}

export default function ReportHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (loading) return (
    <div
      className="card"
      style={{ textAlign: "center", padding: "32px 24px" }}
      role="status"
      aria-label="Loading history"
    >
      <div className="spinner" style={{ margin: "0 auto 12px" }} />
      <p className="text-body-sm">Loading reports…</p>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="card" style={{ textAlign: "center", padding: 28 }}>
      <Lock size={32} color="var(--text-tertiary)" style={{ margin: "0 auto 12px" }} />
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Sign in to save reports</h3>
      <p className="text-body-sm" style={{ marginBottom: 16 }}>
        Reports are linked to your Firebase account and stored in Supabase.
      </p>
      <a href="/login" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
        Sign In with Google →
      </a>
    </div>
  );

  if (history.length === 0) return (
    <div className="card" style={{ textAlign: "center", padding: 32 }}>
      <BarChart2 size={32} color="var(--text-tertiary)" style={{ margin: "0 auto 12px" }} />
      <p className="text-body-sm">No reports yet. Run your first analysis ↑</p>
    </div>
  );

  return (
    <div
      className="card"
      style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}
      role="list"
      aria-label="Recent research reports"
    >
      {history.slice(0, 8).map(h => (
        <a
          key={h.id}
          href={`/report?id=${h.id}`}
          role="listitem"
          aria-label={`${h.company_name} — ${h.recommendation}, score ${h.score}`}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 12px",
            background: "var(--bg-elevated)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)", textDecoration: "none",
            transition: "all var(--duration-fast) var(--ease-out)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "var(--primary-dim)";
            e.currentTarget.style.borderColor = "rgba(59,130,246,0.25)";
            e.currentTarget.style.transform = "translateX(3px)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "var(--bg-elevated)";
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div
              aria-hidden="true"
              style={{
                width: 30, height: 30, borderRadius: "var(--radius-sm)", flexShrink: 0,
                background: h.recommendation === "INVEST" ? "var(--success-dim)" : "var(--danger-dim)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {h.recommendation === "INVEST"
                ? <TrendingUp size={14} color="var(--success)" />
                : <TrendingDown size={14} color="var(--danger)" />
              }
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 1 }} className="truncate">
                {h.company_name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
                <span className="font-mono" style={{ color: "var(--primary)" }}>{h.ticker}</span>
                {" · "}{new Date(h.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 16, fontWeight: 900, lineHeight: 1,
                  color: h.score >= 60 ? "var(--success)" : h.score >= 40 ? "var(--warning)" : "var(--danger)",
                }}
              >
                {h.score}
              </div>
            </div>
            <Badge variant={h.recommendation === "INVEST" ? "invest" : "pass"}>
              {h.recommendation}
            </Badge>
            <ArrowRight size={13} color="var(--text-tertiary)" aria-hidden="true" />
          </div>
        </a>
      ))}

      {history.length > 8 && (
        <a href="/history" className="btn btn-ghost btn-sm" style={{ textDecoration: "none", justifyContent: "center", marginTop: 4 }}>
          View all {history.length} reports →
        </a>
      )}
    </div>
  );
}
