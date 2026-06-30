import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color?: string;
  sublabel?: string;
  icon?: ReactNode;
}

export default function MetricCard({
  label, value, trend, trendLabel, color, sublabel, icon,
}: MetricCardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "var(--success)" : trend === "down" ? "var(--danger)" : "var(--text-tertiary)";

  return (
    <div className="metric-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span className="metric-label">{label}</span>
        {icon && (
          <span style={{ color: color ?? "var(--text-tertiary)", opacity: 0.7 }}>{icon}</span>
        )}
      </div>

      <div
        className="metric-value"
        style={{ color: color ?? "var(--text-primary)" }}
        aria-label={`${label}: ${value}`}
      >
        {value}
      </div>

      {(sublabel || trend) && (
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
          {trend && (
            <>
              <TrendIcon size={12} color={trendColor} aria-hidden="true" />
              <span style={{ fontSize: 11, color: trendColor, fontWeight: 600 }}>
                {trendLabel}
              </span>
            </>
          )}
          {sublabel && !trend && (
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{sublabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
