import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "outline" | "success" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  as?: "button" | "a";
  href?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  outline: "btn-outline",
  success: "btn-success",
  danger: "btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  as = "button",
  href,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    "btn",
    variantClass[variant],
    sizeClass[size],
    fullWidth ? "btn-full" : "",
    className,
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {loading ? <Loader2 size={14} style={{ animation: "spin 0.7s linear infinite" }} /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </>
  );

  if (as === "a" && href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
