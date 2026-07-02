"use client";
import React from "react";

interface InvestraLogoProps {
  size?: number;
  animated?: boolean;
  showGlow?: boolean;
  className?: string;
}

/**
 * Investra brand mark — a bold "I" monogram with an integrated
 * upward-trend notch, rendered as a clean SVG.
 * Designed to look like an actual fintech product, not a template.
 */
export default function InvestraLogo({
  size = 30,
  animated = true,
  showGlow = true,
  className,
}: InvestraLogoProps) {
  const uid = `inv-${size}`;
  const LinearGradient = "linearGradient" as unknown as React.ComponentType<React.SVGProps<SVGLinearGradientElement>>;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {/* Subtle ambient shadow — not an over-the-top glow */}
      {showGlow && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "-2px",
            borderRadius: size * 0.3,
            background: "rgba(59,130,246,0.2)",
            filter: "blur(8px)",
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
      )}

      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        style={{ position: "relative", zIndex: 1, display: "block" }}
        aria-hidden="true"
      >
        {animated && (
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes pulse-dot {
              0%, 100% { opacity: 0.6; transform: scale(0.9); }
              50% { opacity: 1; transform: scale(1.3); }
            }
            .logo-pulse-dot {
              animation: pulse-dot 2s infinite ease-in-out;
              transform-origin: 26px 12px;
            }
          `}} />
        )}

        <defs>
          <LinearGradient id={`${uid}-bg`} x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </LinearGradient>
        </defs>

        {/* Rounded-square base */}
        <rect width="36" height="36" rx="9" fill={`url(#${uid}-bg)`} />

        {/* Subtle top-edge highlight for depth */}
        <rect x="1" y="1" width="34" height="17" rx="8"
          fill="rgba(255,255,255,0.08)"
        />

        {/* Bold "I" monogram with trend notch */}
        {/* Top serif */}
        <rect x="10" y="8" width="16" height="3.5" rx="1.5" fill="#fff" />
        {/* Stem */}
        <rect x="15" y="8" width="6" height="20" rx="1" fill="#fff" />
        {/* Bottom serif */}
        <rect x="10" y="24.5" width="16" height="3.5" rx="1.5" fill="#fff" />

        {/* Upward-trend cut / accent line — makes it unique */}
        <line
          x1="20" y1="20"
          x2="26" y2="12"
          stroke={`url(#${uid}-bg)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Small arrow tip */}
        <circle
          cx="26"
          cy="12"
          r="1.5"
          fill="#34D399"
          className={animated ? "logo-pulse-dot" : undefined}
        />
      </svg>
    </div>
  );
}
