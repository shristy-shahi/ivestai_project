import { ReactNode } from "react";

type EyebrowColor = "primary" | "success" | "warning" | "accent";

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: EyebrowColor;
  title: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
  titleClass?: string;
}

export default function SectionHeader({
  eyebrow, eyebrowColor = "primary", title, subtitle, centered = false, titleClass = "text-display-sm",
}: SectionHeaderProps) {
  return (
    <header style={{ textAlign: centered ? "center" : "left", marginBottom: 48 }}>
      {eyebrow && (
        <p className={`eyebrow eyebrow-${eyebrowColor}`} style={{ marginBottom: 12 }}>
          <span className="glow-dot glow-dot-blue" aria-hidden="true" style={{ marginRight: 2 }} />
          {eyebrow}
        </p>
      )}
      <h2 className={titleClass}>{title}</h2>
      {subtitle && (
        <p className="text-body" style={{ marginTop: 12, maxWidth: centered ? 560 : "none", margin: centered ? "12px auto 0" : "12px 0 0" }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
