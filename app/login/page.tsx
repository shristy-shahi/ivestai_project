"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { isFirebaseReady } from "@/lib/firebase";
import { BarChart2, ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const { signIn, signOut, user, isAuthenticated, isLoading, hydrated } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated && !isLoading) {
      setRedirecting(true);
      setTimeout(() => { window.location.href = "/"; }, 1200);
    }
  }, [hydrated, isAuthenticated, isLoading]);

  const handleGoogleSignIn = async () => {
    if (!isFirebaseReady) {
      setErrorMsg("Firebase is not configured. Open .env and fill in the NEXT_PUBLIC_FIREBASE_* variables.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      await signIn();
    } catch (err: any) {
      const msg =
        err?.code === "auth/popup-closed-by-user"
          ? "Sign-in popup was closed. Try again."
          : err?.message ?? "Sign-in failed. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setStatus("idle");
    setErrorMsg("");
  };

  /* ── already logged in ─────────────────────────────────────── */
  if (isAuthenticated && user) {
    return (
      <div
        style={{
          minHeight: "100vh", background: "var(--bg-base)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          className="card anim-scale-in"
          style={{
            maxWidth: 380, width: "100%", textAlign: "center",
            borderColor: "rgba(16,185,129,0.3)",
            boxShadow: "var(--shadow-glow-success)",
          }}
        >
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Signed in!</h1>
          <p className="text-body-sm" style={{ marginBottom: 24 }}>
            Welcome back,{" "}
            <strong style={{ color: "var(--success)" }}>{user.displayName ?? user.email}</strong>
          </p>
          {redirecting && (
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 20 }}>
              Redirecting to home…
            </p>
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <a
              href="/"
              className="btn btn-success"
              style={{ flex: 1, textDecoration: "none", justifyContent: "center" }}
            >
              Go to Home →
            </a>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── sign in form ──────────────────────────────────────────── */
  return (
    <div
      style={{
        minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)",
        display: "flex", overflow: "hidden", position: "relative",
      }}
    >
      {/* Left panel — decorative (desktop only) */}
      <div
        aria-hidden="true"
        className="hide-mobile"
        style={{
          flex: "0 0 48%", background: "var(--bg-surface)",
          borderRight: "1px solid var(--border)",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center",
          padding: 60, position: "relative", overflow: "hidden",
        }}
      >
        {/* Dot pattern */}
        <div className="bg-dot-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />

        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "20%", left: "30%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(30px)" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "20%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", filter: "blur(30px)" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 360 }}>
          {/* Animated metric cards */}
          {[
            { label: "Analysis Time", value: "< 60s", color: "var(--primary)", delay: "0s" },
            { label: "AI Agents",     value: "7",     color: "var(--success)", delay: "0.15s" },
            { label: "Confidence",    value: "92/100",color: "var(--warning)", delay: "0.3s" },
          ].map(({ label, value, color, delay }) => (
            <div
              key={label}
              className="card anim-slide-up"
              style={{
                marginBottom: 14, display: "flex", alignItems: "center",
                justifyContent: "space-between", animationDelay: delay,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color }}>{value}</span>
            </div>
          ))}

          <div style={{ marginTop: 32 }}>
            <p className="text-caption" style={{ marginBottom: 8 }}>Powered by</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {["LangGraph", "Gemini AI", "Supabase", "Next.js"].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — auth form */}
      <div
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 24px", position: "relative",
        }}
      >
        {/* Background glow */}
        <div aria-hidden="true" style={{ position: "absolute", top: "10%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Back link */}
        <a
          href="/"
          style={{
            position: "absolute", top: 24, left: 24,
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--text-tertiary)",
            textDecoration: "none",
            transition: "color var(--duration-fast) var(--ease-out)",
          }}
          aria-label="Back to Investra home"
          onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
        >
          <ArrowLeft size={14} />
          Back to Investra
        </a>

        <div
          className="anim-slide-up"
          style={{ width: "100%", maxWidth: 400 }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(59,130,246,0.35)",
                animation: "breathe 3s ease-in-out infinite",
              }}
            >
              <BarChart2 size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>Investra</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Investment Research</div>
            </div>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
            Welcome back
          </h1>
          <p className="text-body-sm" style={{ marginBottom: 28 }}>
            Sign in to save reports, track history, and access your research archive.
          </p>

          {/* Error alert */}
          {status === "error" && errorMsg && (
            <div className="alert alert-error anim-slide-up" style={{ marginBottom: 20 }} role="alert">
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Firebase not configured warning */}
          {!isFirebaseReady && (
            <div className="alert alert-warning" style={{ marginBottom: 20 }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                <strong>Firebase not configured.</strong> Open{" "}
                <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 3 }}>.env</code>{" "}
                and fill in the{" "}
                <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 5px", borderRadius: 3 }}>NEXT_PUBLIC_FIREBASE_*</code>{" "}
                values from your{" "}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--warning)", textDecoration: "underline" }}
                >
                  Firebase Console
                </a>.
              </span>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={status === "loading"}
            className="btn btn-ghost btn-full btn-lg"
            style={{ marginBottom: 16 }}
            aria-label="Sign in with Google"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} />
                Signing in…
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }} aria-hidden="true">
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>or explore without signing in</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Guest CTA */}
          <a
            href="/"
            className="btn btn-primary btn-full btn-lg"
            style={{ textDecoration: "none" }}
          >
            Start Analysing Companies →
          </a>

          <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.7 }}>
            By continuing you agree to our Terms of Service &amp; Privacy Policy.
            <br />Reports are saved to Supabase when signed in.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.2-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5l-6-5c-2 1.4-4.4 2.2-6.9 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.6 5C9.5 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6 5c4.2-3.9 6.8-9.6 6.8-16 0-1.2-.1-2.4-.4-3.5z"/>
    </svg>
  );
}
