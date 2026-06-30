import { BarChart2 } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/history", label: "History" },
  { href: "/compare", label: "Compare" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about",   label: "About"   },
];

const TECH_TAGS = ["LangGraph", "Next.js", "Supabase", "Three.js", "Framer Motion", "Recharts"];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border)",
        padding: "48px 24px 36px",
      }}
    >
      <div
        style={{
          maxWidth: 1100, margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: 40,
          alignItems: "start",
        }}
      >
        {/* Brand */}
        <div>
          <a
            href="/"
            aria-label="Investra home"
            style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: 12, textDecoration: "none" }}
          >
            <div
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 8px rgba(59,130,246,0.3)",
              }}
            >
              <BarChart2 size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)" }}>Investra</span>
          </a>

          <p
            style={{ fontSize: 13, color: "var(--text-tertiary)", maxWidth: 340, lineHeight: 1.65, marginBottom: 16 }}
          >
            Institutional-grade AI investment research powered by a 7-agent LangGraph pipeline.
            Not financial advice.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TECH_TAGS.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)",
                  background: "var(--bg-elevated)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-full)", padding: "2px 9px",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Nav Links */}
        <nav aria-label="Footer navigation">
          <ul
            style={{
              listStyle: "none",
              display: "flex", flexDirection: "column", gap: 10,
            }}
          >
            {FOOTER_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  style={{
                    fontSize: 13, color: "var(--text-tertiary)",
                    textDecoration: "none",
                    transition: "color var(--duration-fast) var(--ease-out)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-tertiary)")}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        style={{
          maxWidth: 1100, margin: "32px auto 0",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          © {new Date().getFullYear()} Investra. All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          For educational purposes only · Not financial advice
        </p>
      </div>
    </footer>
  );
}
