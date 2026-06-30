"use client";
import { useState, useEffect, useRef } from "react";
import { useResearchStore } from "@/stores/useResearchStore";
import { useAuth } from "@/lib/AuthContext";
import { Search, ArrowRight, Loader2 } from "lucide-react";

const SUGGESTIONS = ["NVIDIA", "Apple", "Tesla", "Microsoft", "Google", "Amazon", "Meta", "Netflix"];

export default function SearchTerminal() {
  const [input, setInput]         = useState("");
  const [suggIdx, setSuggIdx]     = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [focused, setFocused]     = useState(false);
  const { startResearch, mergeData, completeResearch, setError, isLoading } = useResearchStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  /* typewriter placeholder */
  useEffect(() => {
    const text = SUGGESTIONS[suggIdx];
    let i = 0; setDisplayed("");
    const t = setInterval(() => {
      setDisplayed(text.slice(0, ++i));
      if (i >= text.length) {
        clearInterval(t);
        setTimeout(() => setSuggIdx(p => (p + 1) % SUGGESTIONS.length), 2000);
      }
    }, 90);
    return () => clearInterval(t);
  }, [suggIdx]);

  const run = async (company: string) => {
    if (!company.trim() || isLoading) return;
    startResearch(company);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, userId: user?.uid || null }),
      });

      if (res.status === 403) {
        const errorData = await res.json();
        setError(errorData.error || "Credit limit reached.");
        setTimeout(() => { window.location.href = "/pricing"; }, 2000);
        return;
      }
      if (!res.ok || !res.body) throw new Error("Research API failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const event = JSON.parse(line.slice(6));
          if (event.type === "step_complete") mergeData(event.data);
          if (event.type === "complete") {
            completeResearch();
            const s = useResearchStore.getState().state;
            if (s) fetch("/api/history", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId:    user?.uid   ?? null,
                userName:  user?.displayName ?? null,
                userEmail: user?.email ?? null,
                userPhoto: user?.photoURL ?? null,
                company:        s.company,
                ticker:         s.ticker,
                recommendation: s.recommendation?.decision,
                score:          s.score,
                analysis:       s,
              }),
            }).catch(() => {});
          }
          if (event.type === "error") setError(event.message);
        }
      }
    } catch (e: any) { setError(e.message); }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Glow ring on focus */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: -3, borderRadius: 20,
          background: focused && !isLoading
            ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2))"
            : "transparent",
          filter: "blur(10px)",
          opacity: focused ? 0.8 : 0,
          pointerEvents: "none", zIndex: 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Mac-chrome titlebar */}
      <div
        style={{
          background: "var(--bg-elevated)",
          borderRadius: "14px 14px 0 0",
          padding: "10px 18px",
          display: "flex", alignItems: "center", gap: 8,
          border: "1px solid var(--border)", borderBottom: "none",
          position: "relative", zIndex: 1,
        }}
      >
        <span aria-hidden="true" style={{ width: 11, height: 11, borderRadius: "50%", background: "#EF4444", boxShadow: "0 0 5px rgba(239,68,68,0.4)", display: "inline-block" }} />
        <span aria-hidden="true" style={{ width: 11, height: 11, borderRadius: "50%", background: "#F59E0B", boxShadow: "0 0 5px rgba(245,158,11,0.4)", display: "inline-block" }} />
        <span aria-hidden="true" style={{ width: 11, height: 11, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 5px rgba(16,185,129,0.4)", display: "inline-block" }} />
        <span
          className="font-mono"
          style={{ marginLeft: 10, color: "var(--text-tertiary)", fontSize: 12 }}
        >
          analyst@investra ~ $
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span
            className={`glow-dot ${isLoading ? "glow-dot-amber" : "glow-dot-green"}`}
            aria-hidden="true"
          />
          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
            {isLoading ? "running" : "ready"}
          </span>
        </span>
      </div>

      {/* Terminal body */}
      <div
        style={{
          background: "var(--bg-surface)",
          padding: "24px 20px 28px",
          borderRadius: "0 0 14px 14px",
          border: "1px solid var(--border)", borderTop: "none",
          position: "relative", zIndex: 1, overflow: "hidden",
        }}
      >
        {/* Scanline overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 6px)",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <span
            aria-hidden="true"
            style={{
              color: "var(--primary)", fontFamily: "monospace", fontSize: 20,
              userSelect: "none", flexShrink: 0,
              textShadow: "0 0 8px rgba(59,130,246,0.5)",
            }}
          >
            ❯
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && run(input)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={`Research ${displayed}...`}
            disabled={isLoading}
            autoFocus
            aria-label="Enter company name to research"
            aria-busy={isLoading}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "var(--success)", fontFamily: "monospace", fontSize: 20,
              caretColor: "var(--primary)", letterSpacing: "0.02em",
            }}
          />
          {isLoading && (
            <span
              aria-hidden="true"
              style={{
                fontSize: 12, color: "var(--primary)", fontFamily: "monospace",
                animation: "blink 1s ease-in-out infinite",
              }}
            >
              █
            </span>
          )}
        </div>

        {/* Quick picks */}
        <div
          style={{ marginTop: 18, display: "flex", gap: 7, flexWrap: "wrap", position: "relative", zIndex: 1 }}
          aria-label="Quick picks"
        >
          <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "monospace", alignSelf: "center", marginRight: 2 }}>
            try:
          </span>
          {SUGGESTIONS.slice(0, 6).map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); run(s); }}
              disabled={isLoading}
              aria-label={`Research ${s}`}
              className="chip"
              style={{ fontFamily: "monospace", cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={() => run(input)}
          disabled={isLoading || !input.trim()}
          aria-label={isLoading ? "Analysis in progress" : "Run analysis"}
          className={`btn ${isLoading ? "btn-ghost" : "btn-primary"} btn-lg btn-full`}
          style={{ marginTop: 20, letterSpacing: "0.03em", position: "relative", zIndex: 1, overflow: "hidden" }}
        >
          {/* Shimmer on idle */}
          {!isLoading && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute", top: 0, left: "-100%", width: "60%", height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                animation: "shimmer-sweep 2.5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          )}
          {isLoading ? (
            <>
              <Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} />
              Analyzing…
            </>
          ) : (
            <>
              <Search size={16} />
              Run Analysis
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
