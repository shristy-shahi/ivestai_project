interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function Spinner({ size = "md", label = "Loading…" }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <span className={`spinner spinner-${size === "md" ? "" : size}`} aria-hidden="true" />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
