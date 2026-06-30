import { ReactNode } from "react";

type BadgeVariant = "invest" | "pass" | "neutral" | "primary" | "warning" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
}

export default function Badge({ variant = "neutral", children, dot }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} role="status">
      {dot && (
        <span
          className={`glow-dot ${
            variant === "invest" ? "glow-dot-green" :
            variant === "pass"   ? "glow-dot-red"   :
            variant === "primary"? "glow-dot-blue"  :
            "glow-dot-amber"
          }`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
