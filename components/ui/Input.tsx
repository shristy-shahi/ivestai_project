import { InputHTMLAttributes, forwardRef, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  mono?: boolean;
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ mono = false, label, error, leftIcon, id, className = "", ...props }, ref) => {
    return (
      <div style={{ width: "100%" }}>
        {label && (
          <label
            htmlFor={id}
            style={{
              display: "block", fontSize: 13, fontWeight: 600,
              color: "var(--text-secondary)", marginBottom: 6,
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          {leftIcon && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "var(--text-tertiary)", pointerEvents: "none",
                display: "flex", alignItems: "center",
              }}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={`input ${mono ? "input-mono" : ""} ${error ? "input-error" : ""} ${className}`}
            style={leftIcon ? { paddingLeft: 38 } : undefined}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" style={{ fontSize: 12, color: "var(--danger)", marginTop: 5 }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
