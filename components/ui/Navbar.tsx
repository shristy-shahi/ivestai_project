"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  BarChart2, History, Swords, DollarSign, Info,
  Menu, X, LogIn, RefreshCw
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/history", label: "History",  Icon: History },
  { href: "/compare", label: "Compare",  Icon: Swords },
  { href: "/pricing", label: "Pricing",  Icon: DollarSign },
  { href: "/about",   label: "About",    Icon: Info },
];

interface NavbarProps {
  activePage?: string;
  onNewResearch?: () => void;
}

export default function Navbar({ activePage, onNewResearch }: NavbarProps) {
  const { user, isAuthenticated, hydrated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: "var(--z-nav)" as any,
          background: "rgba(7,11,20,0.8)",
          backdropFilter: "blur(20px) saturate(1.6)",
          borderBottom: "1px solid var(--border)",
          height: 60,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="Investra home"
          style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 30, height: 30, borderRadius: 8,
              background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 12px rgba(59,130,246,0.3)",
              animation: "breathe 3s ease-in-out infinite",
            }}
          >
            <BarChart2 size={15} color="#fff" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Investra
          </span>
          <span
            style={{
              fontSize: 9, fontWeight: 800, background: "var(--primary)",
              color: "#fff", borderRadius: 4, padding: "2px 6px",
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}
          >
            AI
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div
          className="hide-mobile"
          style={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = activePage === label.toLowerCase();
            return (
              <a
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: "var(--radius-md)",
                  fontSize: 13, fontWeight: 500,
                  color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: isActive ? "var(--bg-elevated)" : "transparent",
                  transition: "all var(--duration-fast) var(--ease-out)",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-primary)";
                    e.currentTarget.style.background = "var(--bg-elevated)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Icon size={13} />
                {label}
              </a>
            );
          })}
        </div>

        {/* Auth Area */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {!hydrated ? (
            <div style={{ width: 88, height: 32, borderRadius: "var(--radius-md)", background: "var(--bg-elevated)" }} />
          ) : isAuthenticated && onNewResearch ? (
            <button
              onClick={onNewResearch}
              className="btn btn-ghost btn-sm hide-mobile"
              aria-label="Start new research"
            >
              <RefreshCw size={12} />
              New Research
            </button>
          ) : !isAuthenticated ? (
            <a href="/login" className="btn btn-ghost btn-sm hide-mobile">
              <LogIn size={13} />
              Sign In
            </a>
          ) : null}

          {!isAuthenticated && hydrated && (
            <a
              href="/"
              className="btn btn-primary btn-sm"
              style={{ textDecoration: "none" }}
            >
              Try Free →
            </a>
          )}

          {/* Mobile hamburger */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)", padding: 7, cursor: "pointer",
              color: "var(--text-secondary)", display: "flex",
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation"
          style={{
            position: "fixed", top: 60, left: 0, right: 0, bottom: 0,
            background: "rgba(7,11,20,0.97)", backdropFilter: "blur(20px)",
            zIndex: "calc(var(--z-nav) - 1)" as any,
            display: "flex", flexDirection: "column",
            padding: "var(--space-6) var(--space-5)",
            animation: "slide-up 0.25s var(--ease-spring) both",
          }}
        >
          {NAV_ITEMS.map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 0", fontSize: 18, fontWeight: 600,
                color: "var(--text-secondary)", borderBottom: "1px solid var(--border)",
                textDecoration: "none",
              }}
            >
              <Icon size={18} />
              {label}
            </a>
          ))}
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {!isAuthenticated && (
              <a href="/login" className="btn btn-ghost btn-full" style={{ textDecoration: "none" }}>
                Sign In
              </a>
            )}
            <a href="/" className="btn btn-primary btn-full" style={{ textDecoration: "none" }}>
              Start Researching →
            </a>
          </div>
        </div>
      )}
    </>
  );
}
